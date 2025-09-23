import "~/styles/globals.css";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "~/env";
import { recursive } from "~/fonts";
import { TRPCReactProvider } from "~/trpc/react";

import { defaultMetadata } from "~/lib/metadata";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${recursive.variable}`}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ClerkProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
