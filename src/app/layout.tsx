import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata = {
  verification: {
    google: "OJFJJ4Pm7jJUKEl0VaAr46Z-DII9JiBfFReI9CHGgrE"
  }
};
{/* <meta name="google-site-verification" content="OJFJJ4Pm7jJUKEl0VaAr46Z-DII9JiBfFReI9CHGgrE" /> */}
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