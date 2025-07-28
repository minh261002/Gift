import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { RecaptchaProvider } from "@/providers/recaptcha-provider";
import QueryClientProvider from "@/providers/query-client"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gifty VN | Mua sắm quà tặng",
  description: "Gifty VN | Mua sắm quà tặng",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="mdl-js">
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <RecaptchaProvider>
          <QueryClientProvider>
            {children}
          </QueryClientProvider>
          <Toaster
            position="top-center"
            richColors
            duration={3000}
          />
        </RecaptchaProvider>
      </body>
    </html>
  );
}
