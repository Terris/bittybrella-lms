"use client";

import { useEffect, useState } from "react";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import { Collaboration } from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import jsonwebtoken from "jsonwebtoken";
import {
  Bold,
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
  SquareCode,
  Strikethrough,
  Youtube as YouTubeIcon,
} from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";

const emptyJSON = '""';
const jwt = jsonwebtoken.sign(
  {
    // Use this list to limit the number of documents that can be accessed by this client.
    // An empty array means no access at all.
    // Not sending this property means access to all documents.
    // We are supporting a wildcard at the end of the string (only there).
    // allowedDocumentNames: [],
  },
  process.env.NEXT_PUBLIC_TIPTAP_SECRET_KEY!
);

interface ContentEditorProps {
  documentId?: string;
  initialContent?: string;
}

export const ContentEditor = ({
  documentId,
  initialContent = emptyJSON,
}: ContentEditorProps) => {
  const provider = new TiptapCollabProvider({
    appId: process.env.NEXT_PUBLIC_TIPTAP_APP_ID!,
    name: documentId ?? "test document",
    token: jwt,
    document: new Y.Doc(),
  });

  const editor = useEditor({
    extensions: [
      Image,
      Typography,
      StarterKit.configure({
        history: false,
      }),
      Youtube.configure({
        nocookie: true,
        modestBranding: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing something…",
      }),
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: randomString(10),
          color: randomHexColor(),
        },
      }),
    ],
    content: JSON.parse(initialContent === "" ? emptyJSON : initialContent),
  });

  return (
    <>
      <InlineMenu editor={editor} />
      <BlockMenu editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

const InlineMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, maxWidth: "100%", placement: "top-start" }}
      className="w-full bg-secondary flex flex-wrap gap-1 items-center p-2 shadow-sm rounded"
    >
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
    </BubbleMenu>
  );
};

const BlockMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

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
    <FloatingMenu
      editor={editor}
      tippyOptions={{ duration: 100, maxWidth: "100%", placement: "top-start" }}
      className="w-full bg-secondary flex flex-wrap gap-1 items-center p-2 shadow-sm"
    >
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
    </FloatingMenu>
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

function randomString(n: number) {
  return Math.random().toString(36).substring(n);
}

function randomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
