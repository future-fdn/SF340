import "@/styles/globals.css";

import { Nav } from "@/components/nav";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Noto_Sans_Thai } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-thai",
  display: "swap",
});

export const metadata = {
  title: "Travel Fare Calculator",
  description: "Calculate total fare for traveling methods",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSansThai.variable} font-sans`}>
        <main className="flex h-screen w-screen flex-col items-center justify-center font-thai">
          <div className="w-1/3">
            <nav>
              <Nav className="justify-center" />
            </nav>
            {children}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
