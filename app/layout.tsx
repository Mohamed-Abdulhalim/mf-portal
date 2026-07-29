import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marlow & Finch — Enquiry Desk",
  description: "Internal portal for tracking inbound recruitment enquiries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
