"use client";
import { Editor, useEditorState } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImageIcon,
  Italic,
  Underline,
} from "lucide-react";

interface PostFormToolbarProps {
  editor: Editor | null;
  onImageClick: () => void;
}

export default function PostFormToolbar({ editor, onImageClick }: PostFormToolbarProps) {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold") ?? false,
      isItalic: ctx.editor?.isActive("italic") ?? false,
      isUnderline: ctx.editor?.isActive("underline") ?? false,
      isAlignLeft: ctx.editor?.isActive({ textAlign: "left" }) ?? false,
      isAlignCenter: ctx.editor?.isActive({ textAlign: "center" }) ?? false,
      isAlignRight: ctx.editor?.isActive({ textAlign: "right" }) ?? false,
    }),
  });

  if (!editor || !state) return null;

  const tools = [
    { icon: <Bold className="h-4 w-4" />, action: () => editor.chain().focus().toggleBold().run(), isActive: state.isBold, label: "굵게" },
    { icon: <Italic className="h-4 w-4" />, action: () => editor.chain().focus().toggleItalic().run(), isActive: state.isItalic, label: "기울임" },
    { icon: <Underline className="h-4 w-4" />, action: () => editor.chain().focus().toggleUnderline().run(), isActive: state.isUnderline, label: "밑줄" },
    { icon: <AlignLeft className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign("left").run(), isActive: state.isAlignLeft, label: "왼쪽 정렬" },
    { icon: <AlignCenter className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign("center").run(), isActive: state.isAlignCenter, label: "가운데 정렬" },
    { icon: <AlignRight className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign("right").run(), isActive: state.isAlignRight, label: "오른쪽 정렬" },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-xl bg-slate-100 p-3">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={tool.action}
          aria-label={tool.label}
          className={`cursor-pointer rounded-lg p-1.5 hover:bg-slate-200 ${tool.isActive ? "text-blue-500" : "text-slate-500"}`}
        >
          {tool.icon}
        </button>
      ))}
      <button
        type="button"
        onClick={onImageClick}
        aria-label="이미지 첨부"
        className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-200"
      >
        <ImageIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
