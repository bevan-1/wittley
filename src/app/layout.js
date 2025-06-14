import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// COMPONENT IMPORTS
import Navbar from "./components/navbar";
import UsernamePrompt from "./components/usernameprompt";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Wittley",
  description: "Questions no one asked for. Answers that you didn't see coming. Everyday.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <UsernamePrompt />
        {children}
        <Footer />
      </body>
    </html>
  );
}
