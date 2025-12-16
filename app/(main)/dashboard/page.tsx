'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { getFinancialSummary, getFullFinancialData } from "@/actions/finance-actions";
import { OnboardingView } from "@/components/dashboard/OnboardingView";
import { Loader2, AlertTriangle, LayoutDashboard, Wallet, PieChart, User, Bell, Plus, Search, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 1. Defina o conteúdo da página como um componente interno
const DashboardContent = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [fullData, setFullData] = useState<any>({ transactions: [], debts: [], cards: [], goals: [] });
    const [spaceId, setSpaceId] = useState<string | null>(null);

    // Notifications State
    const [hasUnread, setHasUnread] = useState(true);

    const handleMarkAsRead = () => {
        setHasUnread(false);
        toast.success("Todas as notificações foram marcadas como lidas");
    };

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

                // Fetch Public Profile (Avatar & Name)
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', currentUser.id)
                    .single();
                setProfile(profileData);

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

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const term = e.currentTarget.value.toLowerCase();
            if (!term) return;

            if (term.includes('meta') || term.includes('sonho')) {
                router.push('/metas');
            } else if (['ação', 'fii', 'invest', 'petr4'].some(k => term.includes(k))) {
                router.push('/dashboard?tab=savings');
            } else {
                toast("Buscando por: " + term);
            }
        }
    };

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
                        <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-sm text-zinc-400">Olá, {profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}</h1>
                        <p className="font-bold text-white text-sm">Bem-vindo(a)</p>
                    </div>
                </div>
                {/* Mobile Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 bg-zinc-900/50 rounded-full text-zinc-400 hover:text-white border border-white/5 relative">
                            <Bell className="w-5 h-5" />
                            {/* Bolinha vermelha condicional */}
                            {hasUnread && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#09090b]"></span>}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-zinc-950 border-zinc-800 text-zinc-200 p-0">
                        {/* Header com Botão Limpar */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                            <span className="font-semibold text-sm text-white">Notificações</span>
                            <button
                                onClick={handleMarkAsRead}
                                className="text-xs text-zinc-500 hover:text-[#CCF381] flex items-center gap-1 transition-colors"
                            >
                                <CheckCheck className="w-3 h-3" />
                                Marcar todas como lidas
                            </button>
                        </div>

                        <div className={`py-1 ${!hasUnread ? 'opacity-50' : ''}`}>
                            <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer flex flex-col items-start gap-1 py-3 px-4">
                                <div className="font-medium text-white flex items-center gap-2">💰 Dividendos Recebidos {!hasUnread && <span className="text-[10px] text-zinc-600">(Lido)</span>}</div>
                                <div className="text-xs text-zinc-500">PETR4 pagou R$ 45,00 • Há 2h</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer flex flex-col items-start gap-1 py-3 px-4">
                                <div className="font-medium text-white">🎯 Meta Atingida</div>
                                <div className="text-xs text-zinc-500">"Viagem Disney" chegou a 50%! • Ontem</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer flex flex-col items-start gap-1 py-3 px-4">
                                <div className="font-medium text-white">⚠️ Conta de Luz</div>
                                <div className="text-xs text-zinc-500">Lembrete de vencimento • Hoje</div>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            {/* HEADER DESKTOP (Simple Fallback) */}
            <header className="hidden md:flex w-full bg-[#09090b] z-40 px-8 py-6 justify-between items-center border-b border-white/5">
                <h1 className="text-2xl font-bold">LifeWallet Dashboard</h1>

                {/* Search Bar */}
                <div className="hidden lg:block relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar ativos, metas ou transações..."
                        className="w-full bg-zinc-900 text-zinc-200 text-sm rounded-full pl-10 pr-4 py-2 border border-transparent focus:border-zinc-700 focus:outline-none focus:ring-0 placeholder:text-zinc-600 transition-all"
                        onKeyDown={handleSearch}
                    />
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors outline-none">
                                <Bell className="w-5 h-5" />
                                {hasUnread && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#09090b]"></span>}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 bg-zinc-950 border-zinc-800 text-zinc-200 p-0">
                            {/* Header com Botão Limpar */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                                <span className="font-semibold text-sm text-white">Notificações</span>
                                <button
                                    onClick={handleMarkAsRead}
                                    className="text-xs text-zinc-500 hover:text-[#CCF381] flex items-center gap-1 transition-colors"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    Marcar todas como lidas
                                </button>
                            </div>

                            <div className={`py-1 ${!hasUnread ? 'opacity-50' : ''}`}>
                                <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer flex flex-col items-start gap-1 py-3 px-4">
                                    <div className="font-medium text-white flex items-center gap-2">💰 Dividendos Recebidos {!hasUnread && <span className="text-[10px] text-zinc-600">(Lido)</span>}</div>
                                    <div className="text-xs text-zinc-500">PETR4 pagou R$ 45,00 • Há 2h</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer flex flex-col items-start gap-1 py-3 px-4">
                                    <div className="font-medium text-white">🎯 Meta Atingida</div>
                                    <div className="text-xs text-zinc-500">"Viagem Disney" chegou a 50%! • Ontem</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer flex flex-col items-start gap-1 py-3 px-4">
                                    <div className="font-medium text-white">⚠️ Conta de Luz</div>
                                    <div className="text-xs text-zinc-500">Lembrete de vencimento • Hoje</div>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-6 w-px bg-zinc-800 mx-2 hidden md:block"></div>

                    <p className="text-zinc-400 text-sm hidden md:block">Olá, {profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}</p>
                    <Avatar className="w-9 h-9 border border-zinc-800">
                        <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                        <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL (Scrollável) */}
            <main className="pt-24 md:pt-8 px-6 md:px-8 flex flex-col gap-6 max-w-[1600px] mx-auto">

                {/* SAFEGUARD: Error Boundary for the Complex Tabs */}
                <GlobalErrorBoundary>
                    {/* Prevent render if summary is missing but space exists (race condition/error) */}
                    {spaceId && !summary ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-zinc-500 mb-4" />
                            <p className="text-zinc-500">Carregando resumo financeiro...</p>
                        </div>
                    ) : !spaceId ? (
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