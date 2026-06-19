"use client";

import { MeetingWithHostDTO } from "@/features/dagym/types";
import { format } from "@/shared/lib/date";
import Modal from "@/shared/ui/modal/Modal";

interface MeetingDetailModalProps {
  meeting: MeetingWithHostDTO;
  onClose: () => void;
}

export default function MeetingDetailModal({
  meeting,
  onClose,
}: MeetingDetailModalProps) {
  return (
    <Modal onClose={onClose} isClickToClose>
      <Modal.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{meeting.name}</h2>
          <Modal.CloseButton />
        </div>
      </Modal.Header>

      <div className="flex flex-col gap-4">
        {meeting.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meeting.image}
            alt={meeting.name}
            className="h-40 w-full rounded-xl object-cover"
          />
        )}

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-2.5 py-1">{meeting.type}</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1">{meeting.region}</span>
        </div>

        <dl className="grid grid-cols-3 gap-y-2 text-sm">
          <dt className="text-gray-400">일정</dt>
          <dd className="col-span-2 text-gray-800">
            {meeting.dateTime ? format(meeting.dateTime, "yyyy-MM-dd HH:mm") : "미정"}
          </dd>
          <dt className="text-gray-400">주소</dt>
          <dd className="col-span-2 text-gray-800">{meeting.address ?? "-"}</dd>
          <dt className="text-gray-400">정원</dt>
          <dd className="col-span-2 text-gray-800">
            {meeting.participantCount} / {meeting.capacity}명
          </dd>
          <dt className="text-gray-400">호스트</dt>
          <dd className="col-span-2 text-gray-800">{meeting.host?.name ?? "-"}</dd>
        </dl>

        {meeting.description && (
          <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
            {meeting.description}
          </p>
        )}
      </div>
    </Modal>
  );
}
