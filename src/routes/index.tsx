import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
  validateSearch: (search): { page?: number } => {
    const page = Number(search.page);
    return {
      page: Number.isInteger(page) && page > 0 ? Math.min(page, 500) : undefined,
    };
  },
  component: MovieListPage,
});
