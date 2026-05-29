// import { NextResponse } from "next/server";

// import { get, post } from "@/shared/lib/fetch";

// import { clearAuthCookies, setAuthCookies } from "@/shared/lib/auth/cookies";
// import { cookies } from "next/headers";

// export async function GET() {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;
//   const refreshToken = cookieStore.get("refreshToken")?.value;

//   // 유저 요청 함수
//   const requestMe = (token?: string) => {
//     return get("/users/me", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     });
//   };

//   // 첫 요청
//   let response = await requestMe(accessToken);

//   // accessToken 만료
//   if (response.status === 401) {
//     // refreshToken 없음
//     if (!refreshToken) {
//       await clearAuthCookies();

//       return NextResponse.json({ message: "로그인 필요" }, { status: 401 });
//     }

//     try {
//       const refreshResponse = await post("/auth/refresh", { refreshToken });

//       if (!refreshResponse.ok) {
//         await clearAuthCookies();

//         return NextResponse.json({ message: "토큰 갱신 실패" }, { status: 401 });
//       }

//       const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
//         await refreshResponse.json();

//       // 쿠키 저장
//       await setAuthCookies(newAccessToken, newRefreshToken);

//       // 요청 재시도
//       response = await requestMe(newAccessToken);
//     } catch (error) {
//       await clearAuthCookies();

//       return NextResponse.json({ message: "토큰 갱신 실패" }, { status: 401 });
//     }
//   }

//   // 최종 실패
//   if (!response.ok) {
//     return NextResponse.json({ message: "유저 조회 실패" }, { status: response.status });
//   }

//   const user = await response.json();

//   return NextResponse.json(user);
// }
