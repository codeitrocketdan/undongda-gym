import type { Metadata } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SITE_URL } from "@/shared/config/site";
import { AUTH_HINT_COOKIE } from "@/shared/lib/auth/authHint";
import { Header } from "@/shared/ui/header";
import "./globals.css";
import AppShell from "./providers/AppShell";
import AuthClientProvider from "./providers/AuthClientProvider";
import QueryProvider from "./providers/QueryProvider";

const Pretendard = localFont({
  src: "../shared/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "운동다짐",
    template: "%s | 운동다짐",
  },
  description:
    "다양한 그룹 운동 클래스를 만들고 찾아 예약·참여하고 후기를 남기는 운동 커뮤니티 플랫폼, 운동다짐.",
};

// 첫 페인트 전에 로그인 여부를 <html data-auth>에 기록 (헤더 깜빡임 방지)
const authHintScript = `document.documentElement.dataset.auth=document.cookie.split("; ").includes("${AUTH_HINT_COOKIE}=1")?"in":"out"`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${Pretendard.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: authHintScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <NuqsAdapter>
          <QueryProvider>
            <AuthClientProvider>
              <AppShell header={<Header />}>{children}</AppShell>
            </AuthClientProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
