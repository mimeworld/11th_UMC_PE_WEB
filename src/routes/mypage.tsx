import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../pages/members/my-page";

export const Route = createFileRoute("/mypage")({ component: MyPage });
