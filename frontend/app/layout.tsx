import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "Estancias UMAR | %s",
    default: "Estancias UMAR"
  },
  description: "Sistema de gestión de estancias de la universidad del mar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"className={`h-full antialiased`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"></link>
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider basePath="/estancias/api/auth">
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
