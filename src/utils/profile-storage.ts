import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileStore {
  nickname: string;
  email: string;
  image: string | null;
  updateProfile: (profile: Pick<ProfileStore, "nickname" | "email" | "image">) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      nickname: "",
      email: "",
      image: null,
      updateProfile: ({ nickname, email, image }) => set({ nickname, email, image }),
    }),
    {
      name: "umcine-profile-preview",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ nickname, email, image }) => ({ nickname, email, image }),
    },
  ),
);
