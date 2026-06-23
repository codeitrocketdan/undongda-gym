import { X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import { useFormContext } from "react-hook-form";

interface UploadImageProps {
  imagePreview: string | null;
}

export default function UploadImage({ imagePreview }: UploadImageProps) {
  const { register, setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", file);
    e.target.value = "";
  };

  const handleRemove = () => {
    setValue("image", null);
  };

  const { ref: registerRef } = register("image");

  return (
    <div className="flex flex-col gap-2">
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

      {imagePreview ? (
        <div className="relative w-fit">
          <Image
            src={imagePreview}
            alt="첨부 이미지"
            width={150}
            height={150}
            unoptimized
            className="h-37.5 w-37.5 rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-600 text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleBoxClick}
          className="flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50"
        >
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-2xl">🖼️</span>
            <span className="text-xs">파일 첨부</span>
          </div>
        </div>
      )}
    </div>
  );
}
