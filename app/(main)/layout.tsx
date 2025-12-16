import { MobileNav } from "@/components/MobileNav";
import { Sidebar } from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { redirect } from "next/navigation";
import { UserProfileProvider } from "@/context/UserProfileContext";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // --- Lógica de Servidor para buscar dados do Usuário e Space ---
    const supabase = await createClient();
    let user = null;
    let spaceId = "";

    const { data } = await supabase.auth.getUser();
    user = data.user;

    // Protect these routes - invalid if not logged in
    if (!user) {
        redirect('/login');
    }

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

    return (
        <UserProfileProvider>
            <Sidebar />

            {/* Conteúdo Principal */}
            <main className="min-h-screen transition-all duration-300 pb-24 md:pb-4 md:pl-28 px-5 py-6 md:pr-8">
                <SubscriptionGuard>
                    {children}
                </SubscriptionGuard>
            </main>

            {/* Menu Inferior (Apenas Mobile) */}
            <MobileNav spaceId={spaceId} />
        </UserProfileProvider>
    );
}
