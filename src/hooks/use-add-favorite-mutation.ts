import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    // 갱신이 끝날 때까지 isPending을 유지하도록 Promise를 반환한다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
    onError: () => {
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
