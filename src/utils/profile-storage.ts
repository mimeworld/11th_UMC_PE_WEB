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
      // 서버에는 localStorage가 없으므로 자동 복원을 끄고, 브라우저에서 마운트된 뒤 rehydrate()로 복원한다.
      skipHydration: true,
      partialize: ({ nickname, email, image }) => ({ nickname, email, image }),
    },
  ),
);
