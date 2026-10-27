import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { getTmdbPosterUrl } from "../tmdb-image";

const POSTER_FALLBACK = "/images/movie-placeholder.svg";

export function toMovie(movie: TmdbMovieListItem): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date || "개봉일 미정",
    posterPath: getTmdbPosterUrl(movie.poster_path) ?? POSTER_FALLBACK,
  };
}
