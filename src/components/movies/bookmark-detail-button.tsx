import { useFavoriteStatusQuery } from "../../hooks/use-favorite-status-query";
import { useFavoriteToggle } from "../../hooks/use-favorite-toggle";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkDetailButton({ movieId }: BookmarkButtonProps) {
  const statusQuery = useFavoriteStatusQuery(movieId);
  const isBookmarked = statusQuery.data?.isFavorite ?? false;
  const { toggle, isPending } = useFavoriteToggle(movieId, isBookmarked);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={isBookmarked}
      /* size-8 대신 px-3 py-1.5 및 gap-1.5 추가 */
      className={`flex items-center gap-3 rounded-md px-5 py-3 text-m font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isBookmarked
          ? "bg-blue-500 hover:bg-blue-600" // 북마크 상태
          : "bg-black/60 hover:bg-black/80" // 일반 상태
      }`}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className="pointer-events-none size-4"
      />
      <span>즐겨찾기</span>
    </button>
  );
}