import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A full-stack task management application",
};

import { AntdRegistry } from "@ant-design/nextjs-registry";
import Providers from "./providers";
import ErrorBoundary from "./components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>
          <Providers>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
