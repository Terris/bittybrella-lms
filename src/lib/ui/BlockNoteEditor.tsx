"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor as BlockNoteEditorPrimitive } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

export function BlockNoteEditor() {
  const { resolvedTheme } = useTheme();

  const editor: BlockNoteEditorPrimitive | null = useBlockNote({
    defaultStyles: false,
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
