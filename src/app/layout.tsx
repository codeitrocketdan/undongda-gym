import { Header } from "@/shared/ui/header";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import AppShell from "./providers/AppShell";
import AuthHydration from "./providers/AuthHydration";
import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";

const Pretendard = localFont({
  src: "../shared/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "운동다짐",
  description:
    "다양한 그룹 운동 클래스를 만들고 찾아 예약·참여하고 후기를 남기는 운동 커뮤니티 플랫폼, 운동다짐.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${Pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NuqsAdapter>
          <QueryProvider>
            <AuthHydration>
              <AuthProvider>
                <AppShell header={<Header />}>{children}</AppShell>
                <Script src="https://accounts.google.com/gsi/client" />
                <Script
                  type="text/javascript"
                  src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY}&libraries=services,clusterer&autoload=false`}
                />
              </AuthProvider>
            </AuthHydration>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
