// Important! If you change things here you'll want to be sure Storybook preview is up to date as well.

import {
  Alegreya_Sans as FontSans,
  Cormorant_Infant as FontSerif,
} from "next/font/google";

/* FONT FAVORITES
  Cabin
  Alegreya_Sans
*/

export const fontSans = FontSans({
  weight: ["100", "300", "400", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = FontSerif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-sans",
});
