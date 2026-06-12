import { Nunito, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../components/ReduxProvider";
import { AuthGuard } from "../components/AuthGuard";
import AppShellClient from "../components/layout/AppShell";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
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
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col text-gray-900 font-sans overflow-hidden bg-[#f8f9fc]">
        <ReduxProvider>
          <AuthGuard>
            <AppShellClient>{children}</AppShellClient>
          </AuthGuard>
        </ReduxProvider>
      </body>
    </html>
  );
}
