"use client";

import Modal from "./Modal";
import { useModal } from "./useModal";

export default function ProfileModal() {
  const modal = useModal();
  return (
    <>
      <button onClick={modal.open} className="bg-green-500">
        프로필 보기
      </button>
      {modal.isOpen && (
        <Modal onClose={modal.close}>
          <Modal.Header>
            <Modal.CloseButton />
          </Modal.Header>
          <main>
            <img
              src="https://cdn-icons-png.flaticon.com/512/8847/8847419.png"
              alt="프로필 사진"
              width="100px"
              className="m-auto"
            />

            <p className="text-xl-bold mt-5 mb-4 text-center">럽원즈올</p>

            <p className="rounded-2xl bg-green-200 px-4 py-2 text-center">
              lovewins@codeit.com
            </p>
          </main>
        </Modal>
      )}
    </>
  );
}
