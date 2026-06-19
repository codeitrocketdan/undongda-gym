import { MeetingTypeDTO } from "@/features/dagym/types";
import { parseMeetingTypeDescription } from "@/shared/lib/meetingTypeDescription";
import { Pencil, Trash2 } from "lucide-react";

interface TypeCardProps {
  type: MeetingTypeDTO;
  onEdit: (type: MeetingTypeDTO) => void;
  onDelete: (type: MeetingTypeDTO) => void;
}

export default function TypeCard({ type, onEdit, onDelete }: TypeCardProps) {
  const { imageUrl } = parseMeetingTypeDescription(type.description);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-32 w-full bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={type.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            이미지 없음
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(type)}
            className="cursor-pointer rounded-lg bg-white/80 p-1.5 shadow-sm hover:bg-white"
            aria-label="수정"
          >
            <Pencil size={14} className="text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(type)}
            className="cursor-pointer rounded-lg bg-white/80 p-1.5 shadow-sm hover:bg-white"
            aria-label="삭제"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-800">{type.name}</p>
      </div>
    </div>
  );
}
