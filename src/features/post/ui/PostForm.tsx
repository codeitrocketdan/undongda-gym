"use client";

import Button from "@/shared/ui/button/Button";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PostFormToolbar from "./PostFormToolbar";

export interface PostFormData {
  title: string;
  content: string;
  image: string | null;
}

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export default function PostForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "등록",
}: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ?? null
  );
  const imageInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 기존 blob URL 해제
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = URL.createObjectURL(file);
    setImagePreview(blobUrlRef.current);
    e.target.value = "";
  };

  const editor = useEditor({
    extensions: [
      StarterKit, // Bold, Italic, 단락, 실행취소 등 기본 기능 묶음
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }), // 텍스트 정렬 (StarterKit 미포함)
      ImageExtension, // 이미지 삽입 (StarterKit 미포함)
    ],
    content: initialData?.content ?? "",
  });

  // 에디터 텍스트 변경 시에만 리렌더링 (매 키 입력마다 리렌더링 방지)
  const { contentText, contentHTML } = useEditorState({
    editor,
    selector: (ctx) => ({
      contentText: ctx.editor?.getText() ?? "",
      contentHTML: ctx.editor?.getHTML() ?? "",
    }),
  }) ?? { contentText: "", contentHTML: "" };

  // 수정 모드: 초기값과 비교 / 작성 모드: 내용이 있는지만 확인
  const isDirty = initialData
    ? title !== (initialData.title ?? "") || contentHTML !== (initialData.content ?? "")
    : title.trim() !== "" || contentText.trim() !== "";

  // 언마운트 시 blob URL 해제
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  // TODO: 추후 공통 Modal 컴포넌트로 교체 (현재는 브라우저 기본 confirm 사용)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // TODO: API 기능 개발시 사용
  const handleSubmit = () => {};

  return (
    <div>
      {/* 제목 + 글자수 + 등록 버튼 */}
      <div className="mb-4 flex items-center gap-3">
        <div className="mx-2 flex flex-1 items-center gap-2 border-b border-slate-200 pb-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 30))}
            placeholder="제목을 입력해주세요"
            className="text-base-semibold md:text-3xl-semibold ml-2 flex-1 text-slate-800 outline-none placeholder:text-slate-400"
          />
          <span className="shrink-0 text-xs text-slate-400 md:text-base">
            {title.length}/30
          </span>
        </div>
        <Button
          size="sm"
          className="w-auto shrink-0 disabled:cursor-default"
          onClick={handleSubmit}
          isDisabled={isSubmitting || !title.trim() || !contentText.trim()}
        >
          {isSubmitting ? `${submitLabel} 중...` : submitLabel}
        </Button>
      </div>

      {/* 에디터 카드 */}
      <div className="rounded-2xl bg-white p-4 md:rounded-3xl md:p-10">
        <PostFormToolbar
          editor={editor}
          onImageClick={() => imageInputRef.current?.click()}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <EditorContent
          editor={editor}
          // [&_.ProseMirror]:min-h-125 — 빈 영역도 클릭 가능하도록 ProseMirror 최소 높이 고정
          // [&_.ProseMirror]:outline-none — 포커스 시 브라우저 기본 테두리 제거
          className="custom-scrollbar my-4 max-h-125 min-h-125 overflow-y-auto text-sm text-slate-700 [&_.ProseMirror]:min-h-125 [&_.ProseMirror]:outline-none"
        />
        {imagePreview && (
          <div className="relative mb-4 inline-block">
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
              onClick={() => {
                if (blobUrlRef.current) {
                  URL.revokeObjectURL(blobUrlRef.current);
                  blobUrlRef.current = null;
                }
                setImagePreview(null);
              }}
              className="absolute -top-2 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-600 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
          공백포함: 총 {contentText.length}자 | 공백제외: 총{" "}
          {contentText.replace(/\s/g, "").length}자
        </div>
      </div>
    </div>
  );
}
