"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function UploadImage() {
  const { register, setValue, getValues } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(() => {
    const image = getValues("image");

    if (image instanceof File) {
      return URL.createObjectURL(image);
    }

    if (typeof image === "string") {
      return image;
    }

    return null;
  });

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setValue("image", file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemove = () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setValue("image", null);
    setImagePreview(null);
  };

  const { ref: registerRef } = register("image");

  return (
    <div className="flex flex-col gap-2">
      <input
        id="dagymImage"
        type="file"
        ref={(e) => {
          registerRef(e);
          fileInputRef.current = e;
        }}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <label
        htmlFor="dagymImage"
        className="relative flex h-[150px] w-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
      >
        {imagePreview && (
          <Image
            key={imagePreview}
            src={imagePreview}
            alt="미리보기"
            fill
            unoptimized
            className="object-cover"
          />
        )}
      </label>
    </div>
  );
}
