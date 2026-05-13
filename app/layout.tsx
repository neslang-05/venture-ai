import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Venture — Multi-Agent Startup Intelligence",
  description:
    "A calm operating system for startup thinking. Submit an idea and receive CEO, CTO, Marketing, and Finance analysis powered by multi-agent AI orchestration.",
  keywords: ["startup", "AI", "strategy", "analysis", "multi-agent", "pitch deck"],
  openGraph: {
    title: "Venture — Multi-Agent Startup Intelligence",
    description:
      "Submit a startup idea. Receive structured analysis from four AI agents.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F0F10",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="h-full antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
