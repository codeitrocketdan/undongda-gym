"use client";

import { useCallback, useEffect, useState } from "react";

export function useModal(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const [modalElement, setModalElement] = useState<HTMLElement | null>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const modalRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setModalElement(node); // DOM이 화면에 확실히 그려진 순간 state에 저장!
    }
  }, []);

  // focus Trap 기능 추가 - 웹접근성
  useEffect(() => {
    if (!isOpen || !modalElement) return;
    console.log("handle");

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

    const focusableElements = modalElement.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    console.log("focusableElements", focusableElements);

    // 모달 열리면 첫 요소로 포커스 이동
    if (firstElement) {
      firstElement.focus();
    }

    // 탭 이벤트
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      // Shift + Tab: 역방향 이동 시 첫 번째 요소에서 마지막 요소로 이동
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      }
      // Tab: 정방향 이동 시 마지막 요소에서 첫 번째 요소로 이동
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    console.log("focusableElements", focusableElements);
    window.addEventListener("keydown", handleKeyDown);

    //   return () => {
    //     window.removeEventListener("keydown", handleKeyDown);
    //
    //   };
  }, [isOpen, modalElement]);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
    modalRef,
  };
}
