"use server";

import { redirect } from "next/navigation";
import { Paths } from "~/config/site";

export default async function LoginPage() {
  redirect(Paths.SignInPage);
}
