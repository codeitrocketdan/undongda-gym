import { cookies } from "next/headers";
import { AUTH_HINT_COOKIE, AUTH_HINT_COOKIE_OPTIONS } from "./authHint";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const getAuthCookies = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  return { accessToken, refreshToken };
};

export const setAuthCookies = async (
  accessToken: string,
  refreshToken: string | null
) => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 15,
  });
  if (refreshToken !== null) {
    cookieStore.set("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  cookieStore.set(AUTH_HINT_COOKIE, "1", AUTH_HINT_COOKIE_OPTIONS);
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete(AUTH_HINT_COOKIE);
};
