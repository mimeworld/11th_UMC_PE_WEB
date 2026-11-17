import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { isHTTPError } from "ky";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkDetailButton } from "../../components/movies/bookmark-detail-button";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";
import { useDeleteRatingMutation } from "../../hooks/use-delete-rating-mutation";
import { useMemberRatingsQuery } from "../../hooks/use-member-ratings-query";
import { useRequireLogin } from "../../hooks/use-require-login";
import { useUpdateRatingMutation } from "../../hooks/use-update-rating-mutation";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/tmdb-image";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const requireLogin = useRequireLogin();
  const ratingsQuery = useMemberRatingsQuery();
  const createRating = useCreateRatingMutation();
  const updateRating = useUpdateRatingMutation();
  const deleteRating = useDeleteRatingMutation();
  const myRating = ratingsQuery.data?.find((item) => item.movieId === movieId);

  // 사용자가 입력 중인 값. 없으면 서버에 저장된 내 평점을 보여준다.
  const [draft, setDraft] = useState<{ movieId: number; rating: number; review: string } | null>(null);
  const [savedMovieId, setSavedMovieId] = useState<number | null>(null);
  const currentDraft = draft?.movieId === movieId ? draft : null;
  const rating = currentDraft?.rating ?? myRating?.score ?? 0;
  const review = currentDraft?.review ?? myRating?.comment ?? "";
  const saved = savedMovieId === movieId;
  const isSaving = createRating.isPending || updateRating.isPending;

  const changeDraft = (patch: { rating?: number; review?: string }) => {
    setDraft({ movieId, rating, review, ...patch });
    setSavedMovieId(null);
  };

  const handleSaveRating = () => {
    if (!requireLogin()) return;
    if (rating === 0 || isSaving) return;

    const body = { score: rating, comment: review.trim() || null };
    const onSuccess = () => {
      setDraft(null);
      setSavedMovieId(movieId);
    };

    if (myRating) updateRating.mutate({ ratingId: myRating.ratingId, ...body }, { onSuccess });
    else createRating.mutate({ movieId, ...body }, { onSuccess });
  };

  const handleDeleteRating = () => {
    if (!myRating || deleteRating.isPending) return;
    if (!window.confirm("평점을 삭제할까요?")) return;

    deleteRating.mutate(myRating.ratingId, {
      onSuccess: () => {
        setDraft(null);
        setSavedMovieId(null);
      },
    });
  };

  const movie = movieDetailQuery.data;

  // 1. 숫자가 아닌 파라미터/유효하지 않은 번호 예외 처리
  if (!isValidMovieId) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-16 text-center text-slate-600">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  // 2. 로딩 처리
  if (movieDetailQuery.isPending) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-16 text-center text-slate-600">
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  // 3. 에러 발생 및 데이터 없음 처리
  if (movieDetailQuery.isError || !movie) {
    const error = movieDetailQuery.error;
    const errorMessage =
      isHTTPError(error) && error.response.status === 404
        ? "영화를 찾을 수 없어요."
        : "영화 정보를 불러오지 못했어요.";

    return (
      <main
        className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-16 text-center text-slate-600"
        role="alert"
      >
        <p>{errorMessage}</p>
        {errorMessage !== "영화를 찾을 수 없어요." && (
          <button
            type="button"
            onClick={() => movieDetailQuery.refetch()}
            className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            다시 시도
          </button>
        )}
      </main>
    );
  }

  // 4. 정상 영화 상세 화면
  const posterUrl =
    getTmdbPosterUrl(movie.poster_path) ?? "/images/movie-placeholder.svg";
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path) ?? posterUrl;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <section className="relative h-72 overflow-hidden sm:h-[22rem]">
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-8 text-white sm:px-8">
          <Link
            to="/"
            className="mb-5 inline-flex text-sm text-white/80 transition-colors hover:text-white"
          >
            ← 영화 목록
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {movie.title}
          </h1>
          <p className="mt-2 text-sm text-white/75">{movie.original_title}</p>
          <p className="mt-2 space-x-3 text-sm font-semibold text-white">
            <span>{movie.release_date}</span>
            <span>{movie.genres.map((g) => g.name).join(" · ")}</span>
            {movie.runtime && <span>{movie.runtime}분</span>}
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-4 md:grid-cols-[220px_minmax(0,1fr)_320px] md:py-6">
        <img
          src={posterUrl}
          alt={`${movie.title} 포스터`}
          className="mx-auto w-44 rounded-lg shadow-lg md:mx-0 md:w-full"
        />
        <div>
          <h2 className="text-xl font-bold leading-relaxed text-slate-900">
            {movie.tagline}
          </h2>
          <div className="mt-4">
            <p className="mt-3 leading-7 text-slate-600">{movie.overview}</p>
          </div>
          <div className="mt-8">
            <BookmarkDetailButton movieId={movie.id} />
          </div>
        </div>
        <aside className="border-t border-slate-200 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <h2 className="text-xl font-bold text-slate-900">내 평점</h2>
          <p className="mt-2 text-sm text-slate-400">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="mt-3 flex gap-1" aria-label="별점 선택">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                aria-pressed={rating === value}
                onClick={() => changeDraft({ rating: value })}
                className={`rounded-lg border border-slate-200 bg-white px-2 py-1 text-2xl ${
                  value <= rating ? "text-amber-400" : "text-slate-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            aria-label="영화 감상"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            value={review}
            maxLength={500}
            onChange={(event) => changeDraft({ review: event.target.value })}
            className="mt-3 h-28 w-full resize-y rounded-lg border border-slate-200 bg-white p-3 text-sm outline-blue-500"
          />
          <button
            type="button"
            disabled={rating === 0 || isSaving}
            onClick={handleSaveRating}
            className="mt-2 w-full rounded-lg bg-slate-900 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : myRating ? "평점 수정" : "평점 저장"}
          </button>
          {myRating && (
            <button
              type="button"
              disabled={deleteRating.isPending}
              onClick={handleDeleteRating}
              className="mt-2 w-full rounded-lg border border-red-300 bg-white py-3 text-sm font-bold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteRating.isPending ? "삭제 중..." : "평점 삭제"}
            </button>
          )}
          {saved && (
            <p role="status" className="mt-2 text-sm text-blue-600">
              평점이 저장되었어요.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}