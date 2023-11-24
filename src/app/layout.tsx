import "./globals.css";
import { Source_Sans_3 as FontSans } from "next/font/google";
import { AppProviders } from "@/lib/providers";
import { Masthead, Main } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Toaster } from "@/lib/ui";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
          fontSans.className,
          fontSans.variable
        )}
      >
        <AppProviders>
          <div className="flex flex-col lg:flex-row">
            <Masthead />
            <Main>{children}</Main>
            <Toaster />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
