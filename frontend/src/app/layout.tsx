import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Inria_Serif } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });
const inriaSerif = Inria_Serif({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-inria-serif'
});

export const metadata: Metadata = {
  title: "Memo App",
  description: "A simple memo application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inriaSerif.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
