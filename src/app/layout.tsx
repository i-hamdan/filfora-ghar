import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

// --- Global Font Configuration ---
// Toggle between 1-20 to change the font family across the entire app
const ACTIVE_FONT_INDEX: number = 1; // Change this number to test different fonts

const googleFonts = [
  { id: 1, name: "Outfit", url: "Outfit:wght@300;400;500;600;700" },
  { id: 2, name: "Inter", url: "Inter:wght@300;400;500;600;700" },
  { id: 3, name: "Playfair Display", url: "Playfair+Display:wght@400;500;600;700" },
  { id: 4, name: "Merriweather", url: "Merriweather:wght@300;400;700" },
  { id: 5, name: "Montserrat", url: "Montserrat:wght@300;400;500;600;700" },
  { id: 6, name: "Poppins", url: "Poppins:wght@300;400;500;600;700" },
  { id: 7, name: "Oswald", url: "Oswald:wght@300;400;500;600;700" },
  { id: 8, name: "Dancing Script", url: "Dancing+Script:wght@400;500;600;700" },
  { id: 9, name: "Pacifico", url: "Pacifico" },
  { id: 10, name: "Space Mono", url: "Space+Mono:wght@400;700" },
  { id: 11, name: "Quicksand", url: "Quicksand:wght@300;400;500;600;700" },
  { id: 12, name: "Cinzel", url: "Cinzel:wght@400;500;600;700" },
  { id: 13, name: "Josefin Sans", url: "Josefin+Sans:wght@300;400;500;600;700" },
  { id: 14, name: "Caveat", url: "Caveat:wght@400;500;600;700" },
  { id: 15, name: "Bebas Neue", url: "Bebas+Neue" },
  { id: 16, name: "Comfortaa", url: "Comfortaa:wght@300;400;500;600;700" },
  { id: 17, name: "Cormorant+Garamond", url: "Cormorant+Garamond:wght@300;400;500;600;700" },
  { id: 18, name: "Lobster", url: "Lobster" },
  { id: 19, name: "Abril Fatface", url: "Abril+Fatface" },
  { id: 20, name: "Righteous", url: "Righteous" }
];

const selectedFont = googleFonts.find(f => f.id === ACTIVE_FONT_INDEX) || googleFonts[0];
// ---------------------------------

export const metadata: Metadata = {
  title: "Filfora Ghar | Premium Home Kitchen",
  description: "Authentic home-cooked meals by Asif Rasheed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={`https://fonts.googleapis.com/css2?family=${selectedFont.url}&display=swap`} rel="stylesheet" />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col transition-all duration-300"
        style={{ "--font-sans": `"${selectedFont.name.replace(/\+/g, ' ')}", sans-serif` } as React.CSSProperties}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
