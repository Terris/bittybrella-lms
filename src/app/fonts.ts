import {
  Murecho as FontSans,
  Bricolage_Grotesque as FontDisplay,
} from "next/font/google";

/* FONT FAVORITES
  Gabarito
  Cabin
  Murecho
*/

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontDisplay = FontDisplay({
  subsets: ["latin"],
  variable: "--font-display",
});
