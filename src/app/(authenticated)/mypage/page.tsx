import type { Metadata } from "next";
import { MyPage } from "../../../screens/members/my-page";

export const metadata: Metadata = {
  title: "내 정보",
  robots: { index: false },
};

export default function MyPageRoute() {
  return <MyPage />;
}
