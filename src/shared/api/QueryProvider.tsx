"use client";

// QueryClient: 모든 API 응답 캐시를 관리하는 핵심 객체
// QueryClientProvider: React 컨텍스트를 통해 하위 컴포넌트에 QueryClient를 전달
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // QueryClient를 useState 안에서 생성하는 이유:
  // Next.js는 서버와 브라우저 양쪽에서 실행되는데
  // 컴포넌트 바깥에 선언하면 서버에서 만든 인스턴스가 모든 사용자에게 공유될 수 있음
  // useState(() => new QueryClient()) 형태로 쓰면
  // 브라우저에서 컴포넌트가 마운트될 때 사용자마다 새 인스턴스가 생성됨
  const [queryClient] = useState(() => new QueryClient());

  // QueryClientProvider로 감싸면 하위 컴포넌트 어디서든
  // useQuery, useInfiniteQuery, useMutation 등을 사용할 수 있음
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
