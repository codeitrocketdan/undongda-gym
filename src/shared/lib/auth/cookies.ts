import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// export const getAuthCookies = async () => {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;
//   const refreshToken = cookieStore.get("refreshToken")?.value;
//   return { accessToken, refreshToken };
// };

export const setAuthCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 15,
  });

  cookieStore.set("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};
