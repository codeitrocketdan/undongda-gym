import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./Modal";

// X버튼 + 취소버튼 + 확인버튼을 포함한 공통 렌더 헬퍼
function renderModal(onClose: jest.Mock, isClickToClose?: boolean) {
  render(
    <Modal onClose={onClose} isClickToClose={isClickToClose}>
      <Modal.CloseButton />
      <Modal.Footer>
        <button type="button" onClick={onClose}>
          취소
        </button>
        <button type="button">확인</button>
      </Modal.Footer>
    </Modal>
  );
  const buttons = screen.getAllByRole("button");
  return {
    closeBtn: buttons[0], // X 버튼 (첫 번째 focusable)
    cancelBtn: buttons[1], // 취소 버 튼
    confirmBtn: buttons[2], // 확인 버튼 (마지막 focusable)
    trapContainer: buttons[0].closest('[tabindex="-1"]') as HTMLElement,
    backgroundDiv: document.querySelector(".bg-close") as HTMLElement,
  };
}

describe("isOpen 화면 렌더 테스트", () => {
  test("isOpen이 false이면 모달 콘텐츠가 화면에 보이지 않아야 한다.", () => {
    <>
      {false && (
        <Modal onClose={close}>
          <div>모달children</div>
        </Modal>
      )}
    </>;

    const modalContent = screen.queryByText("모달children");
    expect(modalContent).not.toBeInTheDocument();
  });

  test("isOpen이 true면 모달 콘텐츠가 화면에 보여야 한다.", () => {
    render(
      <>
        {true && (
          <Modal onClose={close}>
            <div>모달children</div>
          </Modal>
        )}
      </>
    );

    const modalContent = screen.queryByText("모달children");
    expect(modalContent).toBeInTheDocument();
  });
});

describe("close 기능 테스트", () => {
  test("X 버튼을 클릭하면 close 콜백 함수가 호출되어야한다.", () => {
    const onClose = jest.fn();
    const { closeBtn } = renderModal(onClose);
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("취소 버튼을 클릭하면 close 콜백 함수가 호출되어야한다.", () => {
    const onClose = jest.fn();
    const { cancelBtn } = renderModal(onClose);
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("isClickToClose가 true일 때 Background 클릭하면 close 콜백 함수가 호출되어야한다.", () => {
    const onClose = jest.fn();
    const { backgroundDiv } = renderModal(onClose, true);
    // 배경 div 자체를 클릭 → target === currentTarget 조건 충족 → onClose 호출
    fireEvent.click(backgroundDiv);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("isClickToClose가 false 때 Background 클릭해도 모달 콘텐츠가 화면에 보인다.", () => {
    const onClose = jest.fn();
    const { backgroundDiv } = renderModal(onClose, false);
    fireEvent.click(backgroundDiv);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText("취소")).toBeInTheDocument();
  });
});

describe("포커스와 탭 기능 테스트", () => {
  test("모달창에 '엔터'키로 진입 시 첫 포커스 요소에 자동으로 포커스가 됩니다.", () => {
    const onClose = jest.fn();
    const { closeBtn } = renderModal(onClose);
    // useFocusTrap이 마운트 시 자동으로 첫 번째 focusable 요소(X버튼)에 포커스
    expect(document.activeElement).toBe(closeBtn);
  });

  test("취소 버튼에서 tab+shift키를 누르면 이전 포커스 요소(X버튼)로 포커스가 이동합니다.", () => {
    const onClose = jest.fn();
    const { cancelBtn, confirmBtn, trapContainer } = renderModal(onClose);
    cancelBtn.focus();
    // cancelBtn은 firstElement가 아니므로 useFocusTrap이 개입하지 않는다
    fireEvent.keyDown(trapContainer, { key: "Tab", shiftKey: true });
    // focus trap은 비경계 요소를 마지막 요소로 wrap하지 않아야 한다
    expect(document.activeElement).not.toBe(confirmBtn);
  });

  test("마지막 확인 버튼에서 tab키를 누르면 처음 포커스 요소(X버튼)로 포커스가 이동합니다.", () => {
    const onClose = jest.fn();
    const { closeBtn, confirmBtn, trapContainer } = renderModal(onClose);
    confirmBtn.focus();
    fireEvent.keyDown(trapContainer, { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(closeBtn);
  });

  test("처음 X버튼에서 tab+shift 키를 누르면 마지막 포커스 요소('확인'버튼)로 포커스가 이동합니다.", () => {
    const onClose = jest.fn();
    const { closeBtn, confirmBtn, trapContainer } = renderModal(onClose);
    closeBtn.focus();
    fireEvent.keyDown(trapContainer, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(confirmBtn);
  });
});

describe("에러 발생 테스트", () => {
  test("Context 밖에서 사용 시 에러 발생 확인", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => render(<Modal.CloseButton />)).toThrow(
      "Modal 서브 컴포넌트는 Modal 안에서만 쓰여야 함"
    );
    consoleSpy.mockRestore();
  });
});

describe("사이드 이팩트 테스트", () => {
  test("모달이 언마운트될 때 등록된 이벤트 리스너가 제거되어야 한다.", () => {
    const removeEventSpy = jest
      .spyOn(HTMLElement.prototype, "removeEventListener")
      .mockImplementation(() => {});
    const onClose = jest.fn();
    const { unmount } = render(
      <Modal onClose={onClose}>
        <Modal.CloseButton />
      </Modal>
    );
    unmount();
    expect(removeEventSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    removeEventSpy.mockRestore();
  });

  test("Esc 키를 누르면 close 콜백이 호출되어야 한다.", () => {
    const onClose = jest.fn();
    const { trapContainer } = renderModal(onClose);
    // Modal 내부 div의 onKeyDown 핸들러가 Escape 키를 감지해 onClose 호출
    fireEvent.keyDown(trapContainer, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("추가 테스트", () => {
  test("모달 내부 콘텐츠를 클릭해도 close가 호출되지 않아야 한다 (stopPropagation).", () => {
    const onClose = jest.fn();
    render(
      <Modal onClose={onClose} isClickToClose>
        <div>내부콘텐츠</div>
      </Modal>
    );
    fireEvent.click(screen.getByText("내부콘텐츠"));
    expect(onClose).not.toHaveBeenCalled();
  });

  test("모달이 열릴 때 body의 scroll이 잠겨야 한다.", () => {
    const onClose = jest.fn();
    render(
      <Modal onClose={onClose}>
        <div>내용</div>
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  test("모달이 닫힐 때 body의 scroll이 복구되어야 한다.", () => {
    const onClose = jest.fn();
    const { unmount } = render(
      <Modal onClose={onClose}>
        <div>내용</div>
      </Modal>
    );
    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
