"use client";
import Modal from "./Modal";
import { useModal } from "./useModal";

export default function LoginModal() {
  const modal = useModal();
  return (
    <>
      <button onClick={modal.open} className="bg-blue-400">
        모달 열기
      </button>

      {modal.isOpen && (
        <Modal onClose={modal.close} isClickToClose={true}>
          <Modal.Header>
            <Modal.CloseButton />
            <p className="mt-5 text-center">로그인이 필요한 서비스입니다.</p>
            <input
              type="text"
              placeholder="인풋에 포커스 먼저 가는지 확인"
              className="border-1 border-gray-800"
              autoFocus
            />
          </Modal.Header>
          <Modal.Footer>
            {/* 버튼 공통 컴포넌트로 교체 */}
            <button onClick={modal.close}>취소</button>
            <button onClick={() => {}}>확인</button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
