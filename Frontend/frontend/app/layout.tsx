import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

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
  description: "Gym app UI",
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
          <nav className="nav">
            <div className="nav-left">
              <div className="brand">Two Bros Gym</div>
              <div className="nav-items">
                <NavBar />
              </div>
            </div>
            <div className="nav-right">
              {/* Account menu rendered inside NavBar for desktop */}
            </div>
          </nav>
        </header>

        <main className="content">{children}</main>

        {/* mobile bottom nav rendered by NavBar within itself via CSS */}
      </body>
    </html>
  );
}
