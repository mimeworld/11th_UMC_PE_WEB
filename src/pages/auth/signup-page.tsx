import { useState, type FormEvent } from 'react'
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate"
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate"
import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/
const DEFAULT_FORM = { email: '', nickname: '', password: '', passwordConfirm: '' }
type FormKey = keyof typeof DEFAULT_FORM

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
  isChecked: false,
}

type DuplicateCheckKey = "email" | "nickname"

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim())
  const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12
  const isPasswordValid = PASSWORD_REGEX.test(form.password)
  const isPasswordConfirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm

  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid
  const canSubmit = isFormValid && !isSubmitting &&
    !duplicateCheck.email.isChecking && !duplicateCheck.nickname.isChecking &&
    !(duplicateCheck.email.isChecked && !duplicateCheck.email.isAvailable) &&
    !(duplicateCheck.nickname.isChecked && !duplicateCheck.nickname.isAvailable)

  // 필드 변경 이벤트 (값을 수정하면 중복 확인 상태 초기화)
  const handleChangeField = (key: FormKey, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }))
    }
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // 중복 확인 API 호출 핸들러
  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid
    if (!isValid || duplicateCheck[key].isChecking) return

    const label = key === "email" ? "이메일" : "닉네임"
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false, isChecked: false },
    }))

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim())
      
      const isAvailable = response.available
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { isChecking: false, isAvailable, isChecked: true },
      }))
      
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`
      )
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { isChecking: false, isAvailable: false, isChecked: false },
      }))
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.")
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!canSubmit || isSubmitting) return;

  setIsSubmitting(true);
  try {
    await signup({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
    setSubmitted(true);
    // 로그인 페이지 연결 후 주석 해제
    // navigate({ to: "/login" });
  } catch {
    alert("회원가입에 실패했어요. 다시 시도해 주세요.");
  } finally {
    setIsSubmitting(false);
  }
};

  const inputClass = 'h-[51px] w-full rounded-[9px] border border-[#dce1e9] bg-white px-4 text-sm text-[#20242b] outline-none placeholder:text-[#929bab] focus:border-[#2862ed] focus:ring-2 focus:ring-[#2862ed]/10'
  const labelClass = 'mb-[7px] block text-[13px] font-bold leading-5 text-[#20242b]'

  return (
    <main className="flex min-h-[calc(100vh-68px)] flex-1 items-center justify-center bg-[#f5f6f8] px-5 py-12">
      <section className="w-full max-w-[448px]" aria-labelledby="signup-title">
        <h1 id="signup-title" className="mb-[18px] text-[32px] font-extrabold leading-[1.3] tracking-[-.055em] text-[#191b20]">회원가입</h1>
        {submitted ? (
          <p className="rounded-lg border border-[#cfe8d8] bg-white p-5 text-sm font-semibold text-[#168448]" role="status">회원가입 정보가 입력되었습니다.</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-[15px]">
            {/* 이메일 */}
            <div>
              <label className={labelClass} htmlFor="signup-email">이메일</label>
              <div className="relative">
                <input
                  id="signup-email"
                  className={`${inputClass} pr-[92px]`}
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(event) => handleChangeField('email', event.target.value)}
                  aria-invalid={form.email.length > 0 && !isEmailValid}
                />
                <button
                  type="button"
                  disabled={!isEmailValid || duplicateCheck.email.isChecking}
                  onClick={() => handleCheckDuplicate("email")}
                  >
                    {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              {form.email.length > 0 && !isEmailValid && (
                <p className="mt-1 text-[11px] text-[#df4545]">올바른 이메일 주소를 입력해 주세요.</p>
              )}
            </div>

            {/* 닉네임 */}
            <div>
              <label className={labelClass} htmlFor="signup-nickname">닉네임</label>
              <div className="relative">
                <input
                  id="signup-nickname"
                  className={`${inputClass} pr-[92px]`}
                  autoComplete="nickname"
                  placeholder="2-12자"
                  value={form.nickname}
                  onChange={(event) => handleChangeField('nickname', event.target.value)}
                  aria-invalid={form.nickname.length > 0 && !isNicknameValid}
                />
                <button
                  type="button"
                  onClick={() => handleCheckDuplicate('nickname')}
                  disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                  className="absolute inset-y-0 right-0 px-4 text-[12px] font-bold text-[#2862ed] disabled:cursor-not-allowed disabled:text-[#a4adbd]"
                >
                  {duplicateCheck.nickname.isChecking ? '확인 중...' : duplicateCheck.nickname.isAvailable ? '확인 완료' : '중복 확인'}
                </button>
              </div>
              {form.nickname.length > 0 && !isNicknameValid && (
                <p className="mt-1 text-[11px] text-[#df4545]">닉네임은 2자 이상 12자 이하로 입력해 주세요.</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className={labelClass} htmlFor="signup-password">비밀번호</label>
              <input
                id="signup-password"
                className={inputClass}
                type="password"
                autoComplete="new-password"
                placeholder="8자 이상"
                value={form.password}
                onChange={(event) => handleChangeField('password', event.target.value)}
                aria-invalid={form.password.length > 0 && !isPasswordValid}
              />
              <p className="mt-[5px] text-[11px] leading-4 text-[#929bab]">
                영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
              </p>
              {form.password.length > 0 && !isPasswordValid && (
                <p className="mt-1 text-[11px] text-[#df4545]">비밀번호 형식이 올바르지 않습니다.</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className={labelClass} htmlFor="signup-password-confirm">비밀번호 확인</label>
              <input
                id="signup-password-confirm"
                className={inputClass}
                type="password"
                autoComplete="new-password"
                placeholder="다시 입력"
                value={form.passwordConfirm}
                onChange={(event) => handleChangeField('passwordConfirm', event.target.value)}
                aria-invalid={form.passwordConfirm.length > 0 && !isPasswordConfirmValid}
              />
              {form.passwordConfirm.length > 0 && !isPasswordConfirmValid && (
                <p className="mt-1 text-[11px] text-[#df4545]">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="h-[49px] w-full rounded-[8px] bg-[#2862ed] text-sm font-bold text-white transition-colors hover:bg-[#1e55d8] disabled:cursor-not-allowed disabled:bg-[#a4adbd] disabled:opacity-100"
            >
              {isSubmitting ? "가입 중" : "가입하기"}
            </button>
            <p className="pt-[2px] text-center text-[13px] text-[#737d8d]">
              이미 계정이 있나요? <a className="font-bold text-[#2862ed] hover:underline" href="/login">로그인</a>
            </p>
          </form>
        )}
      </section>
    </main>
  )
}
