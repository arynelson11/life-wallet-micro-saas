import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/MobileNav";
import { DesktopHeader } from "@/components/DesktopHeader";
import { createClient } from "@/lib/supabase/server";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeWallet - Sua Carteira Digital",
  description: "Gerencie suas finanças de forma inteligente com LifeWallet",
  manifest: "/manifest.json",
  themeColor: "#2563EB", // Azul LifeWallet
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50`}>

        {/* Menu Superior (Apenas Desktop) - Só aparece se logado */}
        {user && <DesktopHeader />}



        {/* Conteúdo Principal */}
        <main className="min-h-screen pb-32 md:pb-10 md:pt-20 transition-all duration-300">
          {/* pb-32: Espaço para a barra mobile não cobrir o conteúdo final
             md:pt-20: Espaço para o header desktop não cobrir o topo
          */}
          <SubscriptionGuard>
            {children}
          </SubscriptionGuard>
        </main>

        {/* Menu Inferior (Apenas Mobile) - Só aparece se logado */}
        {user && <MobileNav spaceId={spaceId} />}

      </body>
    </html>
  );
}