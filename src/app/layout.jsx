import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../components/ReduxProvider";
import { QueryProvider } from "../components/QueryProvider";
import { AuthGuard } from "../components/AuthGuard";
import AppShellClient from "../components/layout/AppShell";
import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Agricom CRM",
  description: "Agricom CRM Dashboard",
  icons: {
    icon: "/maple-leaf.png",
    shortcut: "/maple-leaf.png",
    apple: "/maple-leaf.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col text-gray-900 font-sans overflow-hidden bg-[#f8f9fc]">
        <QueryProvider>
          <ReduxProvider>
            <AuthGuard>
              <AppShellClient>{children}</AppShellClient>
            </AuthGuard>
          </ReduxProvider>
        </QueryProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
