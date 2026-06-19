"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export default function UploadImage() {
  const { control, register, setValue } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageValue = useWatch({
    control,
    name: "image",
  });

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("image", file, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });

    e.target.value = "";
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

      <label
        htmlFor="dagymImage"
        className="relative flex h-[150px] w-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
      >
        {previewUrl ? (
          <Image
            key={previewUrl}
            src={previewUrl}
            alt="미리보기"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-2xl">🖼️</span>
            <span className="text-xs">파일 첨부</span>
          </div>
        )}
      </label>
    </div>
  );
}
