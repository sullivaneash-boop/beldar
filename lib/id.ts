/** Short unique id that works in non-secure contexts (no crypto.randomUUID). */
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
