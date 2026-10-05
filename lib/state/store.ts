"use client";

import { useSyncExternalStore } from "react";
import type { ProjectState } from "@/types/state";
import { DEFAULT_STATE, createDefaultState } from "./defaults";
import { normalizeState } from "./validate";

/**
 * Storage adapter. Swap or wrap this (e.g. with a cloud sync adapter) without
 * touching components — they only talk to `useProject` and `updateProject`.
 */
export interface ProjectStorage {
  load(): unknown;
  save(state: ProjectState): void;
  subscribeExternal?(onChange: () => void): () => void;
}

const KEY = "beldar-hq:project";

export const localStorageAdapter: ProjectStorage = {
  load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked (private mode). State stays in memory; export still works.
      storageError = true;
      emit();
    }
  },
  subscribeExternal(onChange) {
    const handler = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};

let adapter: ProjectStorage = localStorageAdapter;
let state: ProjectState = DEFAULT_STATE;
let loaded = false;
let storageError = false;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function emit() {
  for (const l of listeners) l();
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const raw = adapter.load();
  state = raw ? normalizeState(raw) : createDefaultState();
  window.addEventListener("pagehide", () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = undefined;
      adapter.save(state);
    }
  });
}

function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  let unsubExternal: (() => void) | undefined;
  if (listeners.size === 1 && adapter.subscribeExternal) {
    unsubExternal = adapter.subscribeExternal(() => {
      const raw = adapter.load();
      if (raw) {
        state = normalizeState(raw);
        emit();
      }
    });
    externalUnsub = unsubExternal;
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && externalUnsub) {
      externalUnsub();
      externalUnsub = undefined;
    }
  };
}
let externalUnsub: (() => void) | undefined;

function getSnapshot() {
  ensureLoaded();
  return state;
}

function getServerSnapshot() {
  return DEFAULT_STATE;
}

export function useProject(): ProjectState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const subscribeNoop = () => () => {};
/** True after hydration on the client. Use to avoid flashing default (empty) progress. */
export function useHydrated() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export function useStorageError() {
  return useSyncExternalStore(subscribe, () => storageError, () => false);
}

export function updateProject(recipe: (s: ProjectState) => ProjectState) {
  ensureLoaded();
  state = { ...recipe(state), updatedAt: new Date().toISOString() };
  emit();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = undefined;
    adapter.save(state);
  }, 120);
}

export function replaceProject(next: ProjectState) {
  updateProject(() => normalizeState(next));
}

export function resetProject(keepSettings = true) {
  updateProject((s) => {
    const fresh = createDefaultState();
    return keepSettings ? { ...fresh, settings: s.settings } : fresh;
  });
}

export function getProject() {
  ensureLoaded();
  return state;
}

export function setStorageAdapter(next: ProjectStorage) {
  adapter = next;
  loaded = false;
  ensureLoaded();
  emit();
}
