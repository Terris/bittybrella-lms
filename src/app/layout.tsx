import "./globals.css";
import { AppProviders } from "@/lib/providers";
import { Masthead, Main } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Toaster } from "@/lib/ui";
import { fontSans } from "./fonts";

export const metadata = {
  title: "BittyBrella",
  description: "Learn things, whoot.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          fontSans.variable
        )}
      >
        <AppProviders>
          <div className="min-h-screen">
            <Masthead />
            <Main>{children}</Main>
            <Toaster />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
