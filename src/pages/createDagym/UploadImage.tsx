import { ChangeEvent, useRef, useState } from "react";

export default function UploadImage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 회색 박스 클릭 시
  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 파일이 선택되었을 때 실행되는 함수
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // 서버 전송용 파일 객체 저장
      setImagePreview(URL.createObjectURL(file)); // 미리보기용 임시 URL 생성
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 실제 파일 인풋 */}
      <input
        id="dagymImage"
        type="file"
        ref={fileInputRef}
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
