"use client";
import { useKakaoCallback } from "../model/useKakaoCallback";

// useSearchParams()를 쓰는 부분만 분리해 버튼은 정적 HTML에 포함되도록 함
export const KakaoLoginCallback = () => {
  useKakaoCallback();

  return null;
};
