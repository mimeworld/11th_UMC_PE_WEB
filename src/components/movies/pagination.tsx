interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pageWindowStart = Math.floor((page - 1) / 5) * 5 + 1;
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages - pageWindowStart + 1) },
    (_, index) => pageWindowStart + index,
  );

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="영화 목록 페이지" className="mt-12 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ‹
      </button>
      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
          className={`size-9 rounded-md text-sm font-medium transition-colors ${
            pageNumber === page
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ›
      </button>
    </nav>
  );
}
