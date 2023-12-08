import {
  Alegreya_Sans as FontSans,
  Cormorant_Infant as FontSerif,
} from "next/font/google";

/* FONT FAVORITES
  Cabin
  DM Sans
  Manrope
*/

export const fontSans = FontSans({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = FontSerif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-sans",
});
