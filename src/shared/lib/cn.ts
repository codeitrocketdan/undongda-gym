import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 조건부 클래스(clsx)를 조합한 뒤 충돌하는 Tailwind 클래스는 뒤에 오는 값으로 병합(twMerge)한다.
// 예: cn("px-2 py-1", isActive && "bg-blue-500", "px-4") -> "py-1 bg-blue-500 px-4"
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
