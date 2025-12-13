import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/MobileNav";
import { Sidebar } from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeWallet - Sua Carteira Digital",
  description: "Gerencie suas finanças de forma inteligente com LifeWallet",
  manifest: "/manifest.json",
  themeColor: "#C7F33C", // Lime Green
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LifeWallet",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { ThemeProvider } from "@/components/theme-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- Lógica de Servidor para buscar dados do Usuário e Space ---
  const supabase = await createClient();
  let user = null;
  let spaceId = "";

  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      // 1. Tenta achar onde o usuário é membro
      const { data: member } = await supabase
        .from("space_members")
        .select("space_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (member) {
        spaceId = member.space_id;
      } else {
        // 2. Fallback: Tenta achar onde é dono (caso o trigger tenha falhado ou seja conta antiga)
        const { data: owner } = await supabase
          .from("spaces")
          .select("id")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (owner) spaceId = owner.id;
      }
    }
  } catch (error) {
    // Silencia erro caso o Supabase não esteja configurado ainda (build time)
    console.log("Aguardando configuração do Supabase...");
  }
  // ---------------------------------------------------------------

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Sidebar Global (Apenas Desktop) - Só aparece se logado */}
          {user && <Sidebar />}

          {/* Conteúdo Principal */}
          <main className={`min-h-screen transition-all duration-300 ${user ? 'md:pl-28 pr-4 py-4' : ''}`}>
            <SubscriptionGuard>
              {children}
            </SubscriptionGuard>
          </main>

          {/* Menu Inferior (Apenas Mobile) - Só aparece se logado */}
          {user && <MobileNav spaceId={spaceId} />}

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}