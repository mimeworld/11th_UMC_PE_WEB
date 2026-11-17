import { createFileRoute } from "@tanstack/react-router";
import { EditMyPage } from "../../../pages/members/edit-my-page";

export const Route = createFileRoute("/_authenticated/mypage/edit")({ component: EditMyPage });
