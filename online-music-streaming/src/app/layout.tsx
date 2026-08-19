import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { PlayerBar } from "@/components/player/PlayerBar";
import { MobileNav } from "@/components/layout/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Online Music Streaming",
  description: "Modern music streaming application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-white h-screen flex flex-col overflow-hidden`}>
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto bg-neutral-900 md:m-2 rounded-lg relative pb-32 md:pb-0">
            {children}
          </main>
        </div>
        
        {/* Desktop Player Bar */}
        <div className="hidden md:block">
          <PlayerBar />
        </div>

        {/* Mobile Player & Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-neutral-900">
          <PlayerBar />
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
