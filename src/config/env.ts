// Next.js는 빌드할 때 `process.env.NEXT_PUBLIC_*`를 실제 값으로 바꿔 넣는다.
// 구조 분해나 동적 키로 읽으면 브라우저 번들에 값이 들어가지 않으므로 하나씩 직접 읽는다.
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!tmdbApiBaseUrl || !tmdbAccessToken || !apiBaseUrl) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};
