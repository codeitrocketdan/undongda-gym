import { MeetingWithHostDTO } from "@/features/dagym/types";
import { format } from "@/shared/lib/date";
import Dropdown from "@/shared/ui/dropdown/Dropdown";
import { MoreVertical } from "lucide-react";

interface MeetingRowProps {
  meeting: MeetingWithHostDTO;
  isShared: boolean;
  // 본인(현재 로그인한 admin 계정)이 만든 모임인지 — true일 때만 수정/삭제 노출
  canManage: boolean;
  onClick: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MeetingRow({
  meeting,
  isShared,
  canManage,
  onClick,
  onShare,
  onEdit,
  onDelete,
}: MeetingRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 hover:border-gray-200"
    >
      {meeting.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={meeting.image}
          alt={meeting.name}
          className="size-14 rounded-xl object-cover"
        />
      ) : (
        <div className="size-14 rounded-xl bg-gray-100" />
      )}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{meeting.name}</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {meeting.type}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {meeting.region} · {meeting.dateTime ? format(meeting.dateTime, "yyyy-MM-dd HH:mm") : "일정 미정"}
        </p>
      </div>
      <span className="text-sm text-gray-500">
        {meeting.participantCount} / {meeting.capacity}명
      </span>

      <div onClick={(e) => e.stopPropagation()}>
        <Dropdown>
          <Dropdown.Trigger>
            <button
              type="button"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="더보기"
            >
              <MoreVertical size={18} />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onShare}>
              {isShared ? "링크 복사됨" : "공유하기"}
            </Dropdown.Item>
            {canManage && (
              <>
                <Dropdown.Item onClick={onEdit}>수정하기</Dropdown.Item>
                <Dropdown.Item onClick={onDelete}>삭제하기</Dropdown.Item>
              </>
            )}
            {/*
             * TODO: 코드잇 스프린트 공유 백엔드라 권한 모델(role/isAdmin)을 추가할 수 없어서,
             * 본인이 만든 모임이 아니면 PATCH/DELETE가 항상 401이 남. 그래서 canManage가 false일 때는
             * (= "유저 모임" 탭, 즉 본인이 만들지 않은 모임) 수정/삭제 메뉴를 아예 숨김.
             * 백엔드에 admin 권한 체크가 추가되면 위 canManage 조건을 지우고 아래처럼 항상 노출하면 됨:
             * <Dropdown.Item onClick={onEdit}>수정하기</Dropdown.Item>
             * <Dropdown.Item onClick={onDelete}>삭제하기</Dropdown.Item>
             */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}
