import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { getMyInfo, updateMyInfo } from "../../api/members/my-info";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { useAuthStore } from "../../utils/auth-storage";
import { useProfileStore } from "../../utils/profile-storage";

export function EditMyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const image = useProfileStore((state) => state.image);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("");
  const [previewImage, setPreviewImage] = useState(image);
  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const memberQuery = useQuery({ queryKey: ["members", "me", accessToken], queryFn: getMyInfo, enabled: !!accessToken });
  const mutation = useMutation({ mutationFn: updateMyInfo });

  useEffect(() => {
    if (memberQuery.data) setNickname(memberQuery.data.nickname);
  }, [memberQuery.data]);

  const changeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setMessage("2MB 이하의 이미지 파일을 선택해 주세요.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
        setMessage("");
      }
    };
    reader.readAsDataURL(file);
  };

  const checkNickname = async () => {
    const value = nickname.trim();
    if (value.length < 2 || value.length > 12) return setMessage("닉네임은 2자 이상 12자 이하로 입력해 주세요.");
    if (value === memberQuery.data?.nickname) {
      setCheckedNickname(value);
      return setMessage("현재 사용 중인 닉네임입니다.");
    }
    setChecking(true);
    try {
      const result = await checkNicknameDuplicate(value);
      setCheckedNickname(result.available ? value : null);
      setMessage(result.available ? "사용할 수 있는 닉네임입니다." : "이미 사용 중인 닉네임입니다.");
    } catch {
      setCheckedNickname(null);
      setMessage("중복 확인에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setChecking(false);
    }
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = nickname.trim();
    if (value.length < 2 || value.length > 12) return setMessage("닉네임은 2자 이상 12자 이하로 입력해 주세요.");
    if (value !== memberQuery.data?.nickname && checkedNickname !== value) return setMessage("닉네임 중복 확인을 해 주세요.");
    try {
      const updated = value === memberQuery.data?.nickname ? memberQuery.data : await mutation.mutateAsync(value);
      if (!updated) return;
      queryClient.setQueryData(["members", "me", accessToken], updated);
      updateProfile({ nickname: updated.nickname, email: updated.email, image: previewImage });
      await navigate({ to: "/mypage" });
    } catch (error) {
      setMessage(isHTTPError(error) && error.response.status === 409
        ? "이미 사용 중인 닉네임입니다."
        : "정보를 저장하지 못했습니다. 다시 시도해 주세요.");
    }
  };

  if (!accessToken) return <main className="min-h-[calc(100vh-4rem)] bg-[#f5f6f8] p-8 text-center">로그인이 필요합니다. <Link to="/login" className="text-blue-600">로그인하기</Link></main>;
  if (memberQuery.isPending) return <main className="min-h-[calc(100vh-4rem)] bg-[#f5f6f8] p-8 text-center">회원 정보를 불러오는 중...</main>;
  if (memberQuery.isError) return <main className="min-h-[calc(100vh-4rem)] bg-[#f5f6f8] p-8 text-center" role="alert">회원 정보를 불러오지 못했습니다. 다시 로그인해 주세요.</main>;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#f5f6f8] px-5 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-7xl flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#191b20]">내 정보 수정</h1>
            <p className="mt-1 text-sm text-[#929bab]">닉네임을 변경할 수 있어요. 프로필 이미지는 이 브라우저에만 저장됩니다.</p>
          </div>
          <button type="submit" form="edit-profile-form" disabled={mutation.isPending} className="rounded-md bg-[#2862ed] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e55d8] disabled:opacity-60">{mutation.isPending ? "저장 중..." : "변경사항 저장"}</button>
        </div>
        <form id="edit-profile-form" onSubmit={(event) => void saveProfile(event)} className="mt-12 grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col items-center">
            <button type="button" onClick={() => fileInput.current?.click()} className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#2862ed]" aria-label="프로필 이미지 선택">
              <ProfileAvatar image={previewImage} className="size-24" />
              <span aria-hidden="true" className="absolute bottom-0 right-0 rounded-full border bg-white px-1 text-sm">✎</span>
            </button>
            <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={changeImage} aria-label="프로필 이미지 파일" />
            <p className="mt-3 text-sm font-bold">프로필 이미지</p>
            <p className="text-xs text-[#929bab]">선택 사항 · 최대 2MB · 이 브라우저에만 저장</p>
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="profile-nickname" className="mb-2 block text-sm font-bold">닉네임</label>
              <div className="relative">
                <input id="profile-nickname" value={nickname} disabled={checking} onChange={(event) => { setNickname(event.target.value); setCheckedNickname(null); setMessage(""); }} maxLength={12} className="h-[51px] w-full rounded-[9px] border border-[#dce1e9] bg-white px-4 pr-24 text-sm focus:border-[#2862ed]" />
                <button type="button" onClick={() => void checkNickname()} disabled={checking || nickname.trim().length < 2} className="absolute inset-y-0 right-3 text-xs font-bold text-[#2862ed] disabled:opacity-40">{checking ? "확인 중..." : "중복 확인"}</button>
              </div>
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-2 block text-sm font-bold">이메일</label>
              <input id="profile-email" type="email" value={memberQuery.data.email} readOnly className="h-[51px] w-full rounded-[9px] border border-[#dce1e9] bg-slate-100 px-4 text-sm text-slate-600" />
            </div>
            {message && <p role="status" className="text-sm text-[#737d8d]">{message}</p>}
          </div>
        </form>
      </div>
      <div className="mx-auto mt-12 flex w-full max-w-7xl items-center justify-between gap-4 rounded-lg border border-red-300 bg-red-50 p-5">
        <div><h2 className="text-sm font-bold text-red-600">회원 탈퇴</h2><p className="mt-1 text-xs text-red-500">회원 탈퇴 API가 연결되면 이용할 수 있습니다.</p></div>
        <button type="button" disabled className="shrink-0 rounded-md border border-red-400 bg-white px-3 py-2 text-xs font-bold text-red-500 disabled:cursor-not-allowed disabled:opacity-60">회원 탈퇴</button>
      </div>
    </main>
  );
}
