// 1. 공통 필드 정의
export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string;
  backdropPath?: string;
  genres?: string[];
  runtime?: string;
  tagline?: string;
  overview?: string;
  isBookmarked?: boolean;
}
