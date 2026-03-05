import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SplashScreen } from "@/components/splash-screen";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Isa Sushi",
  description: "O melhor da culinária japonesa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${playfair.variable} antialiased w-full`}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />

        {/* Isolated Background Layer */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
          <div className="absolute inset-0 seigaiha-pattern" />

          {/* Bamboo Decorations */}
          <div className="bamboo-decor top-0 left-0 p-8 text-sushi-black">
            <svg fill="currentColor" height="400" viewBox="0 0 100 200" width="200">
              <path d="M20,200 Q25,150 20,100 Q15,50 20,0" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
              <path d="M22,180 Q40,170 35,155" fill="none" stroke="currentColor" strokeWidth="0.3"></path>
              <path d="M18,140 Q0,130 5,115" fill="none" stroke="currentColor" strokeWidth="0.3"></path>
              <path d="M20,100 Q45,90 40,75" fill="none" stroke="currentColor" strokeWidth="0.3"></path>
            </svg>
          </div>
          <div className="bamboo-decor bottom-0 right-0 p-8 rotate-180 text-sushi-black">
            <svg fill="currentColor" height="400" viewBox="0 0 100 200" width="200">
              <path d="M20,200 Q25,150 20,100 Q15,50 20,0" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
              <path d="M22,180 Q40,170 35,155" fill="none" stroke="currentColor" strokeWidth="0.3"></path>
              <path d="M20,100 Q45,90 40,75" fill="none" stroke="currentColor" strokeWidth="0.3"></path>
            </svg>
          </div>

          {/* Zen Circles */}
          <div className="zen-circle w-64 h-64 -top-20 -right-20 border-sushi-red/10"></div>
          <div className="zen-circle w-96 h-96 -bottom-32 -left-32 border-slate-400/10"></div>
        </div>

        <SplashScreen />
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
