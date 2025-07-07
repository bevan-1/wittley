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
  description: "Get your daily dose of fun, and thought-provoking questions! Answer, comment, and interact with the community in the Wittleverse! New question every day!",
  metadataBase: new URL("https://wittley.com/"),
  openGraph: {
    title: "Wittley",
    description: "Get your daily dose of fun, and thought-provoking questions! Answer, comment, and interact with the community in the Wittleverse! New question every day!",
    url: "https://wittley.com/",
    siteName: "Wittley",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Wittley Social Preview",
      }
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wittley",
    description: "Get your daily dose of fun, and thought-provoking questions! Answer, comment, and interact with the community in the Wittleverse! New question every day!",
    images: ["/og.png"],
    creator: "@wittleydaily",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#1C1C1C", // Jet Black
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://wittley.com" />
      </head>
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
