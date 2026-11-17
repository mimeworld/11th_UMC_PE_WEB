import { useAddFavoriteMutation } from "./use-add-favorite-mutation";
import { useRemoveFavoriteMutation } from "./use-remove-favorite-mutation";
import { useRequireLogin } from "./use-require-login";

// 즐겨찾기 버튼 공통 동작: 비로그인이면 로그인 페이지로 안내하고, 로그인 상태면 등록/해제한다.
export function useFavoriteToggle(movieId: number, isFavorite: boolean) {
  const requireLogin = useRequireLogin();
  const addMutation = useAddFavoriteMutation();
  const removeMutation = useRemoveFavoriteMutation();
  const isPending = addMutation.isPending || removeMutation.isPending;

  const toggle = () => {
    if (!requireLogin() || isPending) return;

    if (isFavorite) removeMutation.mutate(movieId);
    else addMutation.mutate(movieId);
  };

  return { toggle, isPending };
}
