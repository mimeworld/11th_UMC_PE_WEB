import { useBookmarkStore } from "../../utils/bookmark-storage";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button type="button" onClick={() => toggleBookmark(movieId)}
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