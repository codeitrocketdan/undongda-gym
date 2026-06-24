"use client";

import { CopyModal, DeleteConfirmModal } from "@/shared/ui/modal";
import Skeleton from "@/shared/ui/skeleton/Skeleton";
import { CalendarX2 } from "lucide-react";
import Link from "next/link";
import { useAdminMeetingsViewModel } from "../model/useAdminMeetingsViewModel";
import EditMeetingModal from "./EditMeetingModal";
import MeetingDetailModal from "./MeetingDetailModal";
import MeetingRow from "./MeetingRow";

const TABS = [
  { value: "admin", label: "관리자 모임" },
  { value: "user", label: "유저 모임" },
] as const;

export default function MeetingsSection() {
  const {
    tab,
    setTab,
    region,
    setRegion,
    regionOptions,
    meetings,
    isLoading,
    isEmpty,
    observerRef,
    detailModal,
    selectedMeeting,
    handleRowClick,
    editModal,
    editingMeeting,
    handleEdit,
    handleCloseEditModal,
    deleteModal,
    deletingMeeting,
    isDeleting,
    handleOpenDeleteModal,
    handleConfirmDelete,
    sharedMeetingId,
    handleShare,
    copyModal,
    copyMessage,
  } = useAdminMeetingsViewModel();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-2">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`cursor-pointer rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === value
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {regionOptions.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRegion(value)}
            className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              region === value
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
          <CalendarX2 size={48} strokeWidth={1.5} />
          <p className="text-sm">생성된 다짐이 없어요.</p>
          <Link
            href="/admin/create"
            className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            다짐 만들기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {meetings.map((meeting) => (
            <MeetingRow
              key={meeting.id}
              meeting={meeting}
              isShared={sharedMeetingId === meeting.id}
              canManage={tab === "admin"}
              onClick={() => handleRowClick(meeting)}
              onShare={() => handleShare(meeting)}
              onEdit={() => handleEdit(meeting)}
              onDelete={() => handleOpenDeleteModal(meeting)}
            />
          ))}
        </div>
      )}

      <div ref={observerRef} />

      {detailModal.isOpen && selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          onClose={detailModal.close}
        />
      )}

      {editModal.isOpen && editingMeeting && (
        <EditMeetingModal
          meeting={editingMeeting}
          onClose={handleCloseEditModal}
        />
      )}

      {deleteModal.isOpen && deletingMeeting && (
        <DeleteConfirmModal
          title="정말 삭제하시겠습니까?"
          description={`'${deletingMeeting.name}' 다짐을 삭제하면 되돌릴 수 없습니다.`}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={deleteModal.close}
        />
      )}

      {copyModal.isOpen && (
        <CopyModal onClose={copyModal.close} message={copyMessage} />
      )}
    </section>
  );
}
