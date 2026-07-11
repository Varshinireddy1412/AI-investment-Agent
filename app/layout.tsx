import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Investment Research Agent",
  description: "AI Investment Research Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}