import "./globals.css";
import { Inter } from "next/font/google";
import { AppProviders } from "@/lib/providers";
import { Masthead, Main } from "@/lib/layout";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <AppProviders>
          <div className="flex flex-col lg:flex-row">
            <Masthead />
            <Main>{children}</Main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
