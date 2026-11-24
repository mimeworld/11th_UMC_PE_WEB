import type { Metadata } from "next";
import { MovieListPage } from "../screens/movies/movie-list-page";

export const metadata: Metadata = {
  title: "인기 영화",
  description: "지금 인기 있는 영화를 한눈에 둘러보세요.",
};

interface HomePageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

const MAX_PAGE = 500;

// TanStack Router의 validateSearch 역할: ?page 값을 1~500 사이 정수로 검증한다.
function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 0 ? Math.min(page, MAX_PAGE) : 1;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page } = await searchParams;
  return <MovieListPage page={parsePage(page)} />;
}
