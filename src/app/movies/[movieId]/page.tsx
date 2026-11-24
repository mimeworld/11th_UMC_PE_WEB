import type { Metadata } from "next";
import { cache } from "react";
import { getMovieDetail } from "../../../api/movies/get-movie-detail";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../../utils/tmdb-image";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

function parseMovieId(value: string) {
  const movieId = Number(value);
  return Number.isInteger(movieId) && movieId > 0 ? movieId : null;
}

// generateMetadata와 페이지가 같은 요청을 두 번 보내지 않도록 한 번의 렌더링 안에서 결과를 공유한다.
// 실패하면 null을 돌려주고, 404 안내와 다시 시도는 기존처럼 클라이언트 화면에서 처리한다.
const fetchMovieDetail = cache(async (movieId: number) => {
  try {
    return await getMovieDetail(movieId);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: MovieDetailRouteProps): Promise<Metadata> {
  const movieId = parseMovieId((await params).movieId);
  const movie = movieId ? await fetchMovieDetail(movieId) : null;
  if (!movie) return { title: "영화 상세" };

  const description = movie.overview || `${movie.title}의 줄거리와 평점을 확인해 보세요.`;
  const image = getTmdbBackdropUrl(movie.backdrop_path) ?? getTmdbPosterUrl(movie.poster_path);

  return {
    title: movie.title,
    description,
    openGraph: {
      title: movie.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function MovieDetailRoute({ params }: MovieDetailRouteProps) {
  const movieId = parseMovieId((await params).movieId);
  // 서버에서 먼저 가져온 데이터를 React Query의 initialData로 넘겨 첫 화면부터 내용을 보여 준다.
  const initialMovie = movieId ? await fetchMovieDetail(movieId) : null;

  return <MovieDetailPage movieId={movieId} initialMovie={initialMovie ?? undefined} />;
}
