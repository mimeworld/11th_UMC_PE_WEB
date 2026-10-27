import MovieCard from "./movie-card";
import type { Movie } from "../../types/movie";

interface MovieGridProps {
  movies: Movie[];
  //onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          //onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}
