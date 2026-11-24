import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import Header from "../components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: {
    default: "UMC Movie",
    template: "%s | UMC Movie",
  },
  description: "TMDB 인기 영화를 둘러보고, 즐겨찾기와 평점을 남기는 UMCine 영화 서비스예요.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "UMC Movie",
    description: "인기 영화를 둘러보고 나만의 평점을 남겨 보세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
        <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <Image src="/images/logos/tmdb-logo.svg" alt="TMDB" width={154} height={20} className="h-5 w-auto" />
            <p className="text-xs leading-5 text-slate-500">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
