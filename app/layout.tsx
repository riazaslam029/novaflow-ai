import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaFlow AI — From Meeting Notes to Executable Work",
  description: "Enterprise AI Project Manager CRM turning messy meeting transcripts into structured, validated execution plans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
