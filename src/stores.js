import { writable } from "svelte/store";

export const errorMessage = writable("");
export const loaderAddCount = writable(0);
export const loaderDeleteCount = writable(0);
