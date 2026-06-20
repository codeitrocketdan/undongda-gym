"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import avatar from "@/shared/assets/images/avatar.svg";
import Button from "@/shared/ui/button/Button";
import Modal from "@/shared/ui/modal/Modal";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ProfileEditModalProps {
  initialName: string;
  initialEmail: string;
  initialImage: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
}

async function uploadImageToS3(file: File): Promise<string> {
  const { presignedUrl, publicUrl } = await clientFetcher.post<
    { fileName: string; contentType: string; folder: string },
    PresignedUrlResponse
  >("/api/images", {
    fileName: file.name,
    contentType: file.type,
    folder: "users",
  });

  await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return publicUrl;
}

export default function ProfileEditModal({
  initialName,
  initialEmail,
  initialImage,
  onClose,
  onSuccess,
}: ProfileEditModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(initialName);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        imageUrl = await uploadImageToS3(imageFile);
      }

      await clientFetcher.patch<{ name: string; image?: string }, unknown>(
        "/api/users/me",
        {
          name: name.trim(),
          ...(imageUrl !== undefined && { image: imageUrl }),
        }
      );

      await queryClient.invalidateQueries({ queryKey: ["users/me"] });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header className="flex-row justify-between">
        <p className="text-2xl-semibold">프로필 수정하기</p>
        <Modal.CloseButton />
      </Modal.Header>

      <main>
        {/* 프로필 이미지 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-100">
              <Image
                src={imagePreview ?? avatar}
                alt="프로필 이미지"
                fill
                className="object-cover"
                unoptimized={!!imagePreview}
              />
            </div>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-600 text-white hover:bg-slate-700"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm-medium mb-2 block text-slate-800">
            닉네임
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm-medium mb-2 block text-slate-800">
            이메일
          </label>
          <input
            type="email"
            value={initialEmail}
            readOnly
            className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-400 outline-none"
          />
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}
      </main>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1"
          isDisabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          isDisabled={isSubmitting || !name.trim()}
        >
          {isSubmitting ? "수정 중..." : "수정하기"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
