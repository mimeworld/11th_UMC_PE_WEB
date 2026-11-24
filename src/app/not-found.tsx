import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-16 text-center text-slate-600">
      <p>페이지를 찾을 수 없어요.</p>
      <Link href="/" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
        영화 목록으로 돌아가기
      </Link>
    </main>
  );
}
