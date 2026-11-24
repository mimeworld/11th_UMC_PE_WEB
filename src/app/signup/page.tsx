import type { Metadata } from "next";
import { SignupPage } from "../../screens/auth/signup-page";

export const metadata: Metadata = {
  title: "회원가입",
  description: "UMC Movie에 가입하고 좋아하는 영화를 모아 보세요.",
};

export default function SignupRoute() {
  return <SignupPage />;
}
