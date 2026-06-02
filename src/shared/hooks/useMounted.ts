/*
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);

위 코드 작성 시 생기는 Error: Calling setState synchronously within an effect can trigger cascading renders 를 방지하고자
useSyncExternalStore을 사용해 hydration 메커니즘으로 변경
흐름: 서버->클라이언트->subscribe
*/

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function useMounted() {
  return useSyncExternalStore(
    subscribe, // 실제로는 외부 상태 변경 감지 (redux/store/browser api 등)
    () => true, // 클라이언트 상태값 (mounted === true)
    () => false // 서버 렌더 시 상태값 SSR단계에서 사용 (mounted === false)
  );
}
