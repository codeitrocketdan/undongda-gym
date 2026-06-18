"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";

export default function UploadImage() {
  const { register, setValue, watch } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageValue = watch("image");

  const previewUrl = useMemo(() => {
    if (!imageValue) return null;

    if (typeof imageValue === "string") {
      return imageValue;
    }

    if (imageValue instanceof File) {
      return URL.createObjectURL(imageValue);
    }

    return null;
  }, [imageValue]);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("image", file, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const { ref: registerRef } = register("image");

  return (
    <div className="flex flex-col gap-2">
      <input
        id="dagymImage"
        type="file"
        accept="image/*"
        className="hidden"
        ref={(element) => {
          registerRef(element);
          fileInputRef.current = element;
        }}
        onChange={handleFileChange}
      />

      <div
        onClick={handleBoxClick}
        className="relative flex h-[150px] w-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
      >
        {previewUrl ? (
          <Image
            fill
            src={previewUrl}
            alt="미리보기"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-2xl">🖼️</span>
            <span className="text-xs">파일 첨부</span>
          </div>
        )}
      </div>
    </div>
  );
}
