import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/sonner";
import WhatsAppButton from "@/components/whatsapp-button";
import { ClientOnly } from "@/components/client-only";

export const metadata: Metadata = {
  metadataBase: new URL("https://tinaplusfashion.com.br"),
  title: "Tina Plus Fashion | Moda Feminina Plus Size",
  description: "A melhor moda plus size feminina com elegância e sofisticação. Encontre conjuntos, macacões, chemises e muito mais.",
  keywords: ["moda plus size", "roupas femininas plus size", "Tina Plus Fashion", "conjuntos plus size", "vestidos plus size", "moda plus size feminina"],
  authors: [{ name: "Tina Plus Fashion" }],
  icons: {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/274740645_329754545882127_7954351337395034502_n-1767805261577.jpg?width=64&height=64&resize=contain",
    apple: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/ea02e2c1-3719-4f3c-b449-729e57b40008/274740645_329754545882127_7954351337395034502_n-1767805261577.jpg?width=180&height=180&resize=contain",
  },
  verification: {
    google: "pXAv0XEJpYoGhBYjbVADOTGU-kvMd7p1-zY64j_W6xo",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tina Plus Fashion | Moda Feminina Plus Size",
    description: "A melhor moda plus size feminina com elegância e sofisticação.",
    url: "https://tinaplusfashion.com.br",
    siteName: "Tina Plus Fashion",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tina Plus Fashion",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tina Plus Fashion | Moda Feminina Plus Size",
    description: "A melhor moda plus size feminina com elegância e sofisticação.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="pt-BR" suppressHydrationWarning>
        <body className="antialiased">
          <Script
            id="orchids-browser-logs"
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
            strategy="afterInteractive"
            data-orchids-project-id="ea02e2c1-3719-4f3c-b449-729e57b40008"
          />
          <ErrorReporter />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
          />
          <CartProvider>
            {children}
            <ClientOnly>
              <WhatsAppButton />
              <Toaster position="top-center" richColors />
            </ClientOnly>
          </CartProvider>
          <ClientOnly>
            <VisualEditsMessenger />
          </ClientOnly>
        </body>
      </html>
    );
}
