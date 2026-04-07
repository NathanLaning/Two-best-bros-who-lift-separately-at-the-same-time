import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavBar from "./components/NavBar";
import AccountMenu from "./components/AccountMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym App",
  description: "Gym app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="app-shell">
        <header className="site-header">
            <div className="brand">
              <Link
              href="/"
              key="/"
              >Two Bros Gym</Link>
              </div>
            <div className="account">
            <AccountMenu />
            </div>  
        </header>
        

        <main className="content">{children}</main>

        <NavBar />
      </body>
    </html>
  );
}
