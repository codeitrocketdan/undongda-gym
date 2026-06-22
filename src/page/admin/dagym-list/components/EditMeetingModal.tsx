"use client";

import { MeetingWithHostDTO } from "@/features/dagym/types";
import MeetingFormFields from "@/page/admin/dagym-create/components/MeetingFormFields";
import Button from "@/shared/ui/button/Button";
import Modal from "@/shared/ui/modal/Modal";
import { useEditMeetingViewModel } from "../model/useEditMeetingViewModel";

interface EditMeetingModalProps {
  meeting: MeetingWithHostDTO;
  onClose: () => void;
}

export default function EditMeetingModal({
  meeting,
  onClose,
}: EditMeetingModalProps) {
  const { isValid, isSubmitting, submitError, handleSubmit, ...fields } =
    useEditMeetingViewModel(meeting, onClose);

  return (
    <Modal onClose={onClose} isClickToClose>
      <Modal.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">다짐 수정</h2>
          <Modal.CloseButton />
        </div>
      </Modal.Header>

      <Modal.Body>
        <MeetingFormFields {...fields} />

        {submitError && (
          <p className="mb-3 text-sm text-red-500">{submitError}</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="tertiary" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleSubmit} isDisabled={!isValid || isSubmitting}>
          {isSubmitting ? "수정 중..." : "수정하기"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
