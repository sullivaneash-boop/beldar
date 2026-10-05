"use client";

import { uid } from "@/lib/id";

/**
 * Device-local photo storage in IndexedDB. Photos never leave the device
 * unless you include them in a JSON export.
 */
const DB = "beldar-hq";
const STORE = "photos";

export type StoredPhoto = { id: string; dataUrl: string; createdAt: string };

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Downscale to max 1400px JPEG so storage stays small. */
async function compress(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export async function savePhoto(file: File): Promise<string> {
  const dataUrl = await compress(file);
  const photo: StoredPhoto = { id: uid(), dataUrl, createdAt: new Date().toISOString() };
  await tx("readwrite", (s) => s.put(photo));
  return photo.id;
}

export async function putPhotos(photos: StoredPhoto[]) {
  for (const p of photos) await tx("readwrite", (s) => s.put(p));
}

export async function getPhoto(id: string): Promise<StoredPhoto | undefined> {
  try {
    return await tx("readonly", (s) => s.get(id) as IDBRequest<StoredPhoto | undefined>);
  } catch {
    return undefined;
  }
}

export async function getAllPhotos(): Promise<StoredPhoto[]> {
  try {
    return await tx("readonly", (s) => s.getAll() as IDBRequest<StoredPhoto[]>);
  } catch {
    return [];
  }
}

export async function deletePhoto(id: string) {
  await tx("readwrite", (s) => s.delete(id));
}

export async function clearPhotos() {
  await tx("readwrite", (s) => s.clear());
}
