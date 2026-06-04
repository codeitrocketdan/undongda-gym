import { ChangeEvent, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function UploadImage() {
  const { register, setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 회색 박스 클릭 시
  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 파일이 선택되었을 때 실행되는 함수
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { ref: registerRef } = register("image"); // 추후 저장된 이미지 url로 변경 예정

  return (
    <div className="flex flex-col gap-2">
      {/* 실제 파일 인풋 */}
      <input
        id="dagymImage"
        type="file"
        ref={(e) => {
          registerRef(e); // react-hook-form과 ref 연결
          fileInputRef.current = e;
        }}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 회색 클릭 영역 */}
      <div
        onClick={handleBoxClick}
        className="relative flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
      >
        {imagePreview ? (
          // 미리보기가 있을 때
          <img src={imagePreview} alt="미리보기" className="h-full w-full object-cover" />
        ) : (
          // 미리보기가 없을 때
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-2xl">🖼️</span>
            <span className="text-xs">파일 첨부</span>
          </div>
        )}
      </div>
    </div>
  );
}
