import { useFavoriteToggle } from "../../hooks/use-favorite-toggle";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const favoritesQuery = useFavoritesQuery();
  const isBookmarked = favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false;
  const { toggle, isPending } = useFavoriteToggle(movieId, isBookmarked);

  return (
    <button type="button" onClick={toggle} disabled={isPending} aria-pressed={isBookmarked}
     className={`absolute right-2 top-2 flex size-8 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
    isBookmarked
      ? "bg-blue-500 hover:bg-blue-600" // 북마크 상태 (파란색)
      : "bg-black/60 hover:bg-black/80" // 일반 상태 (검은색 반투명)
    }`}
>
    <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className="size-4 pointer-events-none"
      />
    </button>
  );
}