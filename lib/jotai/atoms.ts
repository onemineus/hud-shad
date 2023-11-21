import { atom } from "jotai";

export const isCoach = atom<boolean>(false);
export const accessToken = atom<string>("");
export const isCreating = atom<boolean>(true);