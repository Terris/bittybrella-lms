import React from "react";
import type { Preview } from "@storybook/react";
import { fontSans } from "../src/app/fonts";
import { cn } from "../src/lib/utils";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className={cn(
          "min-h-screen antialiased",
          fontSans.variable,
          fontSans.className
        )}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
