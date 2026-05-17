"use client";
import Modal from "./_Modal";

export default function LoginModal() {
  const modal = Modal.useModal();
  return (
    <>
      <button onClick={modal.open} className="bg-blue-400">
        모달 열기
      </button>
      {modal.isOpen && (
        <>
          <Modal isOpen={modal.isOpen} onClose={modal.close}>
            <Modal.Header>
              <Modal.CloseButton />
              <p className="mt-5 text-center">로그인이 필요한 서비스입니다.</p>
            </Modal.Header>
            <Modal.Footer>
              {/* 버튼 공통 컴포넌트로 교체 */}
              <button onClick={modal.close}>취소</button>
              <button onClick={() => {}}>확인</button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}
