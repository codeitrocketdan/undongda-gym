import QueryProvider from "@/shared/api/QueryProvider";
import Header from "@/shared/ui/header/Header";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const Pretendard = localFont({
  src: "../shared/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "운동다짐",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${Pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NuqsAdapter>
          <QueryProvider>
            <div className="mx-auto w-full max-w-7xl">
              <Header />
              {children}
            </div>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
