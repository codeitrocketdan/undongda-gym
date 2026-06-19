"use client";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/Input";
import Modal from "@/shared/ui/modal/Modal";
import TypeImageUpload from "./TypeImageUpload";

const CATEGORY_OPTIONS = [
  { value: "regular", label: "정규수업" },
  { value: "community", label: "다모여짐" },
];

interface AddTypeModalProps {
  mode: "add" | "edit";
  name: string;
  category: string;
  imagePreview: string | null;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: "regular" | "community") => void;
  onFileChange: (file: File) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function AddTypeModal({
  mode,
  name,
  category,
  imagePreview,
  isSubmitting,
  onNameChange,
  onCategoryChange,
  onFileChange,
  onSubmit,
  onClose,
}: AddTypeModalProps) {
  const isAdd = mode === "add";
  const isValid = name.trim() !== "" && (isAdd ? imagePreview !== null : true);

  return (
    <Modal onClose={onClose} isClickToClose>
      <Modal.Header>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {isAdd ? "새 타입 추가" : "타입 수정"}
          </h2>
          <Modal.CloseButton />
        </div>
      </Modal.Header>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="type-category"
            className="text-sm font-medium text-gray-700"
          >
            타입 분류
          </label>
          <select
            id="type-category"
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as "regular" | "community")
            }
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-700 outline-none"
          >
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="type-name"
            className="text-sm font-medium text-gray-700"
          >
            타입 명칭 <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="type-name"
            placeholder="예) 웨이트, 필라테스"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            대표 이미지 {isAdd && <span className="text-red-500">*</span>}
            {!isAdd && (
              <span className="ml-1 text-xs text-gray-400">
                (변경하지 않으면 기존 이미지 유지)
              </span>
            )}
          </label>
          <TypeImageUpload preview={imagePreview} onFileChange={onFileChange} />
        </div>
      </div>
      <Modal.Footer>
        <Button variant="tertiary" onClick={onClose}>
          취소
        </Button>
        <Button onClick={onSubmit} isDisabled={!isValid || isSubmitting}>
          {isSubmitting ? "처리 중..." : isAdd ? "추가하기" : "수정하기"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
