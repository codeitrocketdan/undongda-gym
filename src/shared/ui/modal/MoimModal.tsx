"use client";

import Modal from "./Modal";
import { useModal } from "./useModal";

export default function MoimModal() {
  const modal = useModal();
  return (
    <>
      <button onClick={modal.open} className="bg-green-600">
        모임 만들기
      </button>
      {modal.isOpen && (
        <Modal onClose={modal.close}>
          <Modal.Header className="flex-row justify-between">
            <p className="text-lg-bold">
              모임 만들기 <span className="text-gray-800">1</span>
              <span className="text-gray-600">/3</span>
            </p>
            <Modal.CloseButton />
          </Modal.Header>
          <div>[콘텐츠]</div>
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
