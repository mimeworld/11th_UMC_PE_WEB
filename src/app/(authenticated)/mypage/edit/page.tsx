import type { Metadata } from "next";
import { EditMyPage } from "../../../../screens/members/edit-my-page";

export const metadata: Metadata = {
  title: "내 정보 수정",
  robots: { index: false },
};

export default function EditMyPageRoute() {
  return <EditMyPage />;
}
