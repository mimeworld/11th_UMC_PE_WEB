import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../../components/movies/bookmark-button";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark?: (movieId: number) => void;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="truncate text-sm font-semibold text-slate-900">{movie.title}</h3>
          <p className="mt-1 text-xs text-slate-500">{movie.releaseDate}</p>
        </div>
      </Link>
      <BookmarkButton movieId={movie.id} />
    </article>
  );
}
