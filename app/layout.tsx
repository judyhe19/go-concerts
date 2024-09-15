import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";

const defaultFont = Noto_Sans_Georgian({ subsets: ["latin"] });

const ORIGIN_URL =
  process.env.NODE === "production"
    ? "https://todovex.ai"
    : "http://localhost:3000";

export const metadata: Metadata = {
  title: "goConcerts.io",
  description:
    "goConcerts.io seamlessly compares ticket prices and suggests music matches using AI",
  icons: {
    icon: "/icon.ico",
  },
  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/testing2">
      <html lang="en">
        <body className={defaultFont.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
