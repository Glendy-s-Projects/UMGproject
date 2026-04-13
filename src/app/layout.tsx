import type { Metadata } from "next";
import { AlgebraProvider } from "@/context/AlgebraProvider";
import { MatematicaDiscretaProvider } from "@/context/MatematicaDiscretaProvider";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { PrecalculoProvider } from "@/context/PrecalculoProvider";
import "./globals.css";
import Providers from "./Providers";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/context/lib/utils";
import { TooltipProvider } from "@/context/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/context/components/ui/sidebar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "UMG Programms",
  description: "UMG Programs ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-mono", jetbrainsMono.variable)}
    >
      <body suppressHydrationWarning>
        <Providers>
          <AlgebraProvider>
            <MatematicaDiscretaProvider>
              <PrecalculoProvider>
                <TooltipProvider>
                  <SidebarProvider defaultOpen={true}>
                    {children}
                    <GoogleAnalytics gaId="G-4DQL7T0JLJ" />
                    <GoogleTagManager gtmId="GTM-TG63XJCB" />
                  </SidebarProvider>
                </TooltipProvider>
              </PrecalculoProvider>
            </MatematicaDiscretaProvider>
          </AlgebraProvider>
        </Providers>
      </body>
    </html>
  );
}
