'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { getFinancialSummary, getFullFinancialData } from "@/actions/finance-actions";
import { OnboardingView } from "@/components/dashboard/OnboardingView";
import { Loader2, AlertTriangle, LayoutDashboard, Wallet, PieChart, User, Bell, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 1. Defina o conteúdo da página como um componente interno
const DashboardContent = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [fullData, setFullData] = useState<any>({ transactions: [], debts: [], cards: [], goals: [] });
    const [spaceId, setSpaceId] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Auth Check
                const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
                if (authError || !currentUser) {
                    router.push("/login");
                    return;
                }
                setUser(currentUser);

                // Space Check
                const { data: space, error: spaceError } = await supabase
                    .from('spaces')
                    .select('id')
                    .eq('owner_id', currentUser.id)
                    .limit(1)
                    .single();

                if (space?.id) {
                    setSpaceId(space.id);
                    // Parallel Fetch
                    const [summaryRes, fullDataRes] = await Promise.all([
                        getFinancialSummary(space.id),
                        getFullFinancialData(space.id)
                    ]);
                    setSummary(summaryRes);
                    setFullData(fullDataRes);
                }
            } catch (error) {
                console.error("Critical Dashboard Error:", error);
                toast.error("Erro ao carregar dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-[#CCF381]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white pb-24 font-sans selection:bg-[#CCF381] selection:text-black">

            {/* HEADER MOBILE (Fixed & Glass) */}
            <header className="fixed top-0 w-full bg-[#09090b]/90 backdrop-blur-md z-40 px-6 py-4 flex justify-between items-center border-b border-white/5 md:hidden">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-sm text-zinc-400">Olá, {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}</h1>
                        <p className="font-bold text-white text-sm">Bem-vindo(a)</p>
                    </div>
                </div>
                <button className="p-2 bg-zinc-900/50 rounded-full text-zinc-400 hover:text-white border border-white/5">
                    <Bell className="w-5 h-5" />
                </button>
            </header>

            {/* HEADER DESKTOP (Simple Fallback) */}
            <header className="hidden md:flex w-full bg-[#09090b] z-40 px-8 py-6 justify-between items-center border-b border-white/5">
                <h1 className="text-2xl font-bold">LifeWallet Dashboard</h1>
                <div className="flex items-center gap-4">
                    <p className="text-zinc-400">Olá, {user?.user_metadata?.full_name || 'Usuário'}</p>
                    <Avatar>
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL (Scrollável) */}
            <main className="pt-24 md:pt-8 px-6 md:px-8 flex flex-col gap-6 max-w-[1600px] mx-auto">

                {/* SAFEGUARD: Error Boundary for the Complex Tabs */}
                <GlobalErrorBoundary>
                    {!spaceId ? (
                        <div className="w-full bg-[#111] border border-[#222] rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden mt-4">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#CCF381] to-transparent opacity-50"></div>
                            <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-4 text-[#CCF381]">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Configure seu Espaço</h2>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed max-w-xs mx-auto">Sua independência financeira começa aqui. Crie seu Espaço Pessoal agora para acessar o Dashboard.</p>
                            <OnboardingView />
                        </div>
                    ) : (
                        <DashboardTabs
                            summary={summary}
                            fullData={fullData}
                            spaceId={spaceId}
                            profileId={user?.id}
                        />
                    )}
                </GlobalErrorBoundary>

            </main>

            {/* BOTTOM NAVIGATION (Barra Inferior Fixa - Mobile Only) */}
            <nav className="fixed bottom-0 left-0 w-full bg-[#050505] border-t border-[#1A1A1A] pb-safe pt-2 px-6 flex justify-between items-center z-50 h-20 md:hidden">
                <button className="flex flex-col items-center gap-1 text-[#CCF381]">
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Dash</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                    <Wallet className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Carteira</span>
                </button>
                <button className="flex flex-col items-center justify-center -mt-8 bg-[#CCF381] text-black w-14 h-14 rounded-full shadow-[0_0_20px_rgba(204,243,129,0.3)] transition-transform active:scale-95">
                    <Plus className="w-8 h-8" />
                </button>
                <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                    <PieChart className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Metas</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Perfil</span>
                </button>
            </nav>
        </div>
    );
};

// 2. FORCE O CARREGAMENTO DINÂMICO SEM SSR (A Correção Real)
const DashboardPage = dynamic(() => Promise.resolve(DashboardContent), {
    ssr: false, // ISSO IMPEDE O ERRO DE SERVIDOR
    loading: () => <div className="h-screen w-full bg-black flex items-center justify-center text-[#CCF381]"><Loader2 className="w-10 h-10 animate-spin" /></div>
});

export default DashboardPage;