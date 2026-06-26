import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/storefront/cart-provider";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { CartDrawer } from "@/components/storefront/cart-drawer";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "حكايا الطيب | Hakaya Altayib | عود وعطور فاخرة",
    template: "%s | حكايا الطيب",
  },
  description:
    "حكايا الطيب — وجهتك الفاخرة للعود والعطور الأصيلة. عود كمبودي، دهن عود ملكي، عطور فرنسية، بخور ومباخر فاخرة.",
  keywords: ["حكايا الطيب", "عود", "عطور", "دهن عود", "بخور", "عود كمبودي", "Hakaya Altayib"],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://hakaya-altayib.com",
    siteName: "حكايا الطيب",
    title: "حكايا الطيب | Hakaya Altayib",
    description: "وجهتك الفاخرة للعود والعطور الأصيلة.",
    images: [{ url: "/logo.png", width: 800, height: 800, alt: "Hakaya Altayib" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "حكايا الطيب | Hakaya Altayib",
    description: "وجهتك الفاخرة للعود والعطور الأصيلة.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexSansArabic.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
