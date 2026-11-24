import type { Metadata } from "next";
import { SearchPage } from "../../screens/movies/search-page";

interface SearchRouteProps {
  searchParams: Promise<{ query?: string | string[] }>;
}

function parseQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export async function generateMetadata({ searchParams }: SearchRouteProps): Promise<Metadata> {
  const query = parseQuery((await searchParams).query)?.trim();
  return {
    title: query ? `'${query}' 검색 결과` : "영화 검색",
    description: "보고 싶은 영화를 제목으로 찾아보세요.",
  };
}

export default async function SearchRoute({ searchParams }: SearchRouteProps) {
  const query = parseQuery((await searchParams).query);
  // key로 검색어가 바뀌면 입력창 상태를 URL 값으로 다시 맞춘다.
  return <SearchPage key={query ?? ""} query={query} />;
}
