import Header from "@/shared/ui/header/Header";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
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
                <Header />
                <div className="mx-auto w-full max-w-7xl">{children}</div>
                <Script src="https://accounts.google.com/gsi/client" />
              </AuthProvider>
            </AuthHydration>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
