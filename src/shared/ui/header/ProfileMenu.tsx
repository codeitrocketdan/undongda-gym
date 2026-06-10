"use client";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface Props {
  onLogout: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileMenu({ onLogout, setIsOpen }: Props) {
  const router = useRouter();
  return (
    <div className="absolute top-full right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <button
        onClick={() => {
          setIsOpen(false);
          router.push("/mypage");
        }}
        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
      >
        마이페이지
      </button>

      <button
        onClick={onLogout}
        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
      >
        로그아웃
      </button>
    </div>
  );
}
