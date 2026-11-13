/**
 * ROOT LAYOUT: wraps every page (App Router: `app/layout.tsx`).
 * A Server Component; the providers inside it are client components.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

// next/font downloads the fonts at build time and serves them from this app,
// so visitors' browsers never contact Google.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LinkPulse",
    description: "Create and browse short links, and watch the LinkPulse API work",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        // suppressHydrationWarning: next-themes sets class="dark" on <html>
        // before React loads, so the server's HTML and the browser's differ there.
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full bg-background antialiased`}
            suppressHydrationWarning
        >
            <body className="flex min-h-full flex-col bg-muted/40">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TooltipProvider delayDuration={200}>
                        {children}
                        <Toaster richColors position="bottom-right" />
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
