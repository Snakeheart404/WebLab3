import { writable } from "svelte/store";

export const errorMessage = writable("");
export const loadersCount = writable(0);