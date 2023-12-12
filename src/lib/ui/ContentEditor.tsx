"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Loader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import {
  Bold,
  Check,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Image as ImageIcon,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  SquareCode,
  Strikethrough,
  Undo,
  Youtube as YouTubeIcon,
} from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";

// define your extension array
const extensions = [
  Image,
  Typography,
  StarterKit,
  Youtube.configure({
    nocookie: true,
    modestBranding: true,
  }),
];

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
    <div>
      {editable && <ToolBar editor={editor} loading={loading} />}
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
};

const ToolBar = ({
  editor,
  loading,
}: {
  editor: Editor | null;
  loading?: boolean;
}) => {
  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const addImage = () => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background flex flex-wrap gap-1 items-center p-2 shadow-sm">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        helpText="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        helpText="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        helpText="Strike"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        helpText="Inline code"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
        helpText="Paragraph"
      >
        <Pilcrow className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        helpText="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        helpText="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        helpText="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        helpText="Bullet list"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        helpText="Numbered list"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        helpText="Code block"
      >
        <SquareCode className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        helpText="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        helpText="Divider"
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={addImage}
        isActive={editor.isActive("image")}
        helpText="Image"
      >
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={addYoutubeVideo}
        isActive={editor.isActive("youtube")}
        helpText="YouTube video"
      >
        <YouTubeIcon className="w-4 h-4" />
      </ToolbarButton>

      <div>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          helpText="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          helpText="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>
      <div className="ml-auto">
        {loading ? (
          <Loader className="h-3 w-3 text-yellow-300" />
        ) : (
          <Check className="h-3 w-3 text-success" />
        )}
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  helpText?: string;
}

const ToolbarButton = ({
  children,
  onClick,
  disabled,
  isActive,
  helpText,
}: ToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button
            onClick={onClick}
            size="sm"
            variant={isActive ? "secondary" : "ghost"}
            disabled={disabled}
            style={{ pointerEvents: disabled ? "none" : "auto" }}
          >
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      {helpText && <TooltipContent>{helpText}</TooltipContent>}
    </Tooltip>
  );
};
