import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-5 w-auto" />
          <p className="text-xs leading-5 text-slate-500">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </footer>
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
