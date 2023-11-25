"use client";

import { Button, Loader, Text } from "@/lib/ui";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Check,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  SquareCode,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useEffect, useState } from "react";

// define your extension array
const extensions = [StarterKit];

const emptyJSON = '""';
interface ContentEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export const ContentEditor = ({
  initialContent = emptyJSON,
  onChange,
  editable = true,
}: ContentEditorProps) => {
  const [ready, setReady] = useState(false);

  const editor = useEditor({
    extensions,
    content: JSON.parse(initialContent === "" ? emptyJSON : initialContent),
  });

  const contentString = JSON.stringify(editor?.getJSON());
  const debouncedContent = useDebounce(contentString, 1000);
  const hasChanges = initialContent !== debouncedContent;
  const loading = !ready || hasChanges || contentString !== debouncedContent;

  // set the state to ready when the initialContent and debouncedContent are in sync
  useEffect(() => {
    if (ready) return;
    if (
      !initialContent ||
      initialContent === '""' ||
      initialContent === debouncedContent
    ) {
      setReady(true);
    }
  }, [ready, initialContent, debouncedContent]);

  // Fire onChange when the debouncedContent changes
  useEffect(() => {
    if (!ready || !hasChanges || !editable) return;
    onChange?.(debouncedContent);
  }, [debouncedContent, editable, hasChanges, onChange, ready]);

  return (
    <div className="border rounded">
      {editable && <ToolBar editor={editor} />}
      <EditorContent editor={editor} className="p-4" />
      {editable && (
        <div className="sticky bottom-0 z-50 bg-background flex border-t p-2 justify-end">
          {loading ? (
            <Loader className="h-3 w-3 text-yellow-300" />
          ) : (
            <Check className="h-3 w-3 text-primary" />
          )}
        </div>
      )}
    </div>
  );
};

const ToolBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-background flex flex-wrap gap-1 items-center p-2 border-b">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
      >
        <Pilcrow className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
      >
        <SquareCode className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>
      <div>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const ToolbarButton = ({
  children,
  onClick,
  disabled,
  isActive,
}: ToolbarButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant={isActive ? "secondary" : "ghost"}
    >
      {children}
    </Button>
  );
};
