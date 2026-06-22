"use client";

import { PublicUserDTO } from "@/features/my-page/types";
import { clientFetcher } from "@/shared/api/clientFetcher";
import avatar from "@/shared/assets/images/avatar.svg";
import { maskEmail } from "@/shared/lib/maskEmail";
import { publicUserQueries } from "@/shared/lib/queryKeys";
import Button from "@/shared/ui/button/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Modal from "./Modal";

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

type EditModeProps = {
  mode: "edit";
  initialName: string;
  initialEmail: string;
  initialImage: string | null;
  onClose: () => void;
  onSuccess?: () => void;
};

type ReadModeProps = {
  mode: "read";
  userId: number;
  onClose: () => void;
};

type ProfileModalProps = EditModeProps | ReadModeProps;

export default function ProfileModal(props: ProfileModalProps) {
  const { mode, onClose } = props;
  const queryClient = useQueryClient();

  const userId = mode === "read" ? props.userId : null;

  const { data: publicProfile, isLoading: isPublicProfileLoading } = useQuery({
    queryKey: publicUserQueries.detail(userId ?? -1),
    queryFn: () => clientFetcher.get<PublicUserDTO>(`/api/users/${userId}`),
    enabled: userId !== null,
  });

  const [name, setName] = useState(mode === "edit" ? props.initialName : "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    mode === "edit" ? props.initialImage : null
  );
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
    if (mode !== "edit" || !name.trim()) return;

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
      props.onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "read" && (isPublicProfileLoading || !publicProfile)) {
    return (
      <Modal onClose={onClose}>
        <Modal.Header className="flex-row justify-between">
          <p className="text-2xl-semibold">프로필</p>
          <Modal.CloseButton />
        </Modal.Header>
        <main>
          <p className="py-10 text-center text-sm text-slate-400">
            불러오는 중...
          </p>
        </main>
      </Modal>
    );
  }

  const displayImage =
    mode === "edit" ? imagePreview : (publicProfile?.image ?? null);
  const displayName = mode === "edit" ? name : (publicProfile?.name ?? "");
  const displayEmail =
    mode === "edit"
      ? props.initialEmail
      : maskEmail(publicProfile?.email ?? "");

  return (
    <Modal onClose={onClose}>
      <Modal.Header className="flex-row justify-between">
        <p className="text-2xl-semibold">
          {mode === "edit" ? "프로필 수정하기" : "프로필"}
        </p>
        <Modal.CloseButton />
      </Modal.Header>

      <main>
        {/* 프로필 이미지 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-100">
              <Image
                src={displayImage ?? avatar}
                alt="프로필 이미지"
                fill
                className="object-cover"
                unoptimized={!!displayImage}
              />
            </div>
            {mode === "edit" && (
              <>
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
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm-medium mb-2 block text-slate-800">
            이름
          </label>
          {mode === "edit" ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none"
            />
          ) : (
            <p className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              {displayName}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="text-sm-medium mb-2 block text-slate-800">
            이메일
          </label>
          <p className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-400">
            {displayEmail}
          </p>
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}
      </main>

      <Modal.Footer>
        {mode === "edit" ? (
          <>
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
          </>
        ) : (
          <Button onClick={onClose} className="flex-1">
            닫기
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
