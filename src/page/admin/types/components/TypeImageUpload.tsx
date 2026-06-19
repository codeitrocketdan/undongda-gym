import { ImageIcon } from "lucide-react";
import { useRef } from "react";

interface TypeImageUploadProps {
  preview: string | null;
  onFileChange: (file: File) => void;
}

export default function TypeImageUpload({
  preview,
  onFileChange,
}: TypeImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-colors hover:bg-gray-100"
    >
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file);
        }}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="미리보기"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <ImageIcon size={24} strokeWidth={1.5} />
          <span className="text-xs">클릭하여 이미지 첨부</span>
        </div>
      )}
    </div>
  );
}
