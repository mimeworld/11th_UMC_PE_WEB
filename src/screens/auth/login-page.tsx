"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-68px)] flex-1 items-center justify-center bg-[#f5f6f8] px-5 py-12">
      <section className="w-full max-w-[448px]" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-[18px] text-[32px] font-extrabold leading-[1.3] tracking-[-.055em] text-[#191b20]">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-[15px]">
          <div>
            <label className="mb-[7px] block text-[13px] font-bold leading-5 text-[#20242b]" htmlFor="login-email">
              이메일
            </label>
            <div className="relative">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#929bab]">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                <path d="m4.5 7 7.5 5.5L19.5 7" />
              </svg>
              <input
                id="login-email"
                className="h-[51px] w-full rounded-[9px] border border-[#dce1e9] bg-white pl-10 pr-4 text-sm text-[#20242b] outline-none placeholder:text-[#929bab] focus:border-[#2862ed] focus:ring-2 focus:ring-[#2862ed]/10"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-[7px] block text-[13px] font-bold leading-5 text-[#20242b]" htmlFor="login-password">
              비밀번호
            </label>
            <div className="relative">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#929bab]">
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v2" />
              </svg>
              <input
                id="login-password"
                className="h-[51px] w-full rounded-[9px] border border-[#dce1e9] bg-white pl-10 pr-4 text-sm text-[#20242b] outline-none placeholder:text-[#929bab] focus:border-[#2862ed] focus:ring-2 focus:ring-[#2862ed]/10"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={!canSubmit || loginMutation.isPending} className="h-[49px] w-full rounded-[8px] bg-[#2862ed] text-sm font-bold text-white transition-colors hover:bg-[#1e55d8] focus:outline-none focus:ring-2 focus:ring-[#2862ed] focus:ring-offset-2 disabled:opacity-60">
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>

          <p className="pt-[2px] text-center text-[13px] text-[#737d8d]">
            처음이신가요?{" "}
            <Link href="/signup" className="font-bold text-[#2862ed] hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
