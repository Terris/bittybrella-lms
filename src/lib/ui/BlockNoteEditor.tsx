"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor as BlockNoteEditorPrimitive } from "@blocknote/core";
import {
  BlockNoteView,
  Theme,
  useBlockNote,
  darkDefaultTheme,
} from "@blocknote/react";
import "@blocknote/core/style.css";

const theme = {
  ...darkDefaultTheme,
  componentStyles: (theme) => ({
    // Adds basic styling to the editor.
    Editor: {
      backgroundColor: "red",
      borderRadius: 0,
      fontFamily: "Times New Roman",
      padding: 0,
    },
  }),
} satisfies Theme;

export function BlockNoteEditor() {
  const { resolvedTheme } = useTheme();

  const editor: BlockNoteEditorPrimitive | null = useBlockNote({
    defaultStyles: false,
  });

  return <BlockNoteView editor={editor} theme={theme} />;
}
