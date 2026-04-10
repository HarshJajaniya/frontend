import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetmom",
  description: "AI Meeting Automation",
  verification: {
    google: "OJFJJ4Pm7jJUKEl0VaAr46Z-DII9JiBfFReI9CHGgrE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Topbar />
            <main className="p-8 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}