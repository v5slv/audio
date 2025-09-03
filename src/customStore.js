import { create } from "zustand";

const useCustomStore = create((set) => ({
    songs: [],
    setSongs: (songs) => set((state) => ({ songs: songs })),
}));

export default useCustomStore;
