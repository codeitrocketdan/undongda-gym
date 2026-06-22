"use client";

import { CommentDTO } from "@/features/post/types";
import { formatRelativeDate } from "@/shared/lib/formatDate";
import Author from "@/shared/ui/author/Author";
import Button from "@/shared/ui/button/Button";
import Dropdown from "@/shared/ui/dropdown/Dropdown";
import { ProfileModal, useProfileModal } from "@/shared/ui/modal";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface CommentItemProps {
  comment: CommentDTO;
  isOwner: boolean;
  onEdit: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}

export default function CommentItem({
  comment,
  isOwner,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const profileModal = useProfileModal();

  const handleSave = () => {
    if (!editValue.trim()) return;
    onEdit(comment.id, editValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(comment.content);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditValue(comment.content);
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col border-b border-slate-200 py-4 last:border-none">
      {/* 작성자 + 날짜 */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Author
            name={comment.author.name}
            image={comment.author.image}
            className="font-semibold"
            onClick={() => profileModal.open(comment.author.id)}
          />
          <span className="text-xs text-slate-500">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>

        {isOwner && !isEditing && (
          <Dropdown>
            <Dropdown.Trigger>
              <MoreHorizontal className="h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-600" />
            </Dropdown.Trigger>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleStartEdit}>수정</Dropdown.Item>
              <Dropdown.Item onClick={() => onDelete(comment.id)}>
                삭제
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      {/* 본문 or 수정 */}
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-auto"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button
              size="sm"
              className="w-auto"
              onClick={handleSave}
              isDisabled={!editValue.trim()}
            >
              수정
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-700 md:text-base">{comment.content}</p>
      )}

      {profileModal.isOpen && profileModal.userId !== null && (
        <ProfileModal
          mode="read"
          userId={profileModal.userId}
          onClose={profileModal.close}
        />
      )}
    </div>
  );
}
