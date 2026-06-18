"use client";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActionMenu({ onEdit, onDelete }: ActionMenuProps) {
  return (
    <div className="absolute top-full right-0 z-50 mt-2 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <button
        onClick={onEdit}
        className="w-full cursor-pointer px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-gray-50"
      >
        수정하기
      </button>

      <button
        onClick={onDelete}
        className="w-full cursor-pointer px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
      >
        삭제하기
      </button>
    </div>
  );
}
