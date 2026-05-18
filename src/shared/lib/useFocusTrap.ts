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
    ]
      // .map((selector) => `${selector}:not([data-autofocus-ignore])`)
      .join(",");

    let firstElement: HTMLElement | null = null;
    let lastElement: HTMLElement | null = null;

    const updateFocusableElements = () => {
      const focusableElements = element.querySelectorAll<HTMLElement>(focusableSelectors);
      if (focusableElements.length > 0) {
        firstElement = focusableElements[0];
        lastElement = focusableElements[focusableElements.length - 1];

        if (!element.contains(document.activeElement)) {
          // 모달 내부에 'autofocus' 속성이 지정된 요소가 있다면 먼저 포커스
          const autoFocusElement = element.querySelector<HTMLElement>("[autofocus]");
          if (autoFocusElement) {
            autoFocusElement.focus();
          } else {
            firstElement.focus();
          }
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

    element.addEventListener("keydown", handleKeyDown);

    return () => {
      observer.disconnect();
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return ref;
}
