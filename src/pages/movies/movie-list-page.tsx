import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import type { Movie } from "../../types/movie";
import { toMovie } from "../../utils/movies/to-movie";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
    staleTime: 30 * 1000,
  });

  const movies: Movie[] = moviesQuery.data?.results.map(toMovie) ?? [];
  const totalPages = moviesQuery.data
    ? Math.min(moviesQuery.data.total_pages, 500)
    : 1;

  if (moviesQuery.isPending) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-950">영화</h1>
        
        {moviesQuery.isError && (
          <div className="py-16 text-center" role="alert">
            <p className="text-sm text-red-600">
              {moviesQuery.error.message || "영화 목록을 불러오지 못했어요."}
            </p>
            <button
              type="button"
              onClick={() => moviesQuery.refetch()}
              className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              다시 시도
            </button>
          </div>
        )}

        {!moviesQuery.isError && movies.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-500">
            표시할 영화가 없어요.
          </p>
        )}

        {!moviesQuery.isError && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(nextPage) =>
                navigate({ search: (previous) => ({ ...previous, page: nextPage }) })
              }
            />
          </>
        )}
      </div>
    </main>
  );
}