"use client";

import { useEffect, useRef } from "react";

export function useFocusTrap<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const focusableSelectors = [
      "a[href]",
      "area[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    let firstElement: HTMLElement | null = null;
    let lastElement: HTMLElement | null = null;

    const updateFocusableElements = () => {
      const focusableElements = element.querySelectorAll<HTMLElement>(focusableSelectors);
      if (focusableElements.length > 0) {
        firstElement = focusableElements[0];
        lastElement = focusableElements[focusableElements.length - 1];

        if (!element.contains(document.activeElement)) {
          firstElement.focus();
        }
      }
    };

    // 렌더링 타이밍 이슈(null 에러) 해결
    const observer = new MutationObserver(() => {
      updateFocusableElements();
    });

    // 초기 실행 후 감지
    updateFocusableElements();
    observer.observe(element, { childList: true, subtree: true });

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !firstElement || !lastElement) return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return ref;
}
