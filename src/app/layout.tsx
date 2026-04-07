import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nyro ROaaS - Operaciones como Servicio para Retail",
  description: "Nyro ROaaS - Operaciones como Servicio para Retail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>
          {`
            .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          `}
        </style>
      </head>
      <body className={`${inter.className} antialiased selection:bg-primary-container selection:text-on-primary-container`}>
        {children}
      </body>
    </html>
  );
}
