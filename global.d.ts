import "daum-postcode"; // 설치한 타입을 불러옵니다.

declare global {
  interface Window {
    daum: typeof daum;
  }
}
