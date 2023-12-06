"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";

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

interface ContentEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  content?: string;
}

export const ContentReader = ({
  content = emptyJSON,
  className,
}: ContentEditorProps) => {
  const editor = useEditor({
    editable: false,
    extensions,
    content: JSON.parse(content === "" ? emptyJSON : content),
  });

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
};
