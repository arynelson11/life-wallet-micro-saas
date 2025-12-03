'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, List, PieChart, User, Search, Plus, Calendar } from "lucide-react";
import { TransactionDialog } from "./TransactionDialog";

export function MobileNav({ spaceId }: { spaceId: string }) {
    const pathname = usePathname();

    // Função para verificar se o link está ativo
    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
            {/* Container Principal "Soft UI" - iOS Dock Style */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 p-2 pb-3 relative">

                {/* 1. Topo: Barra de Busca Decorativa */}
                <div className="mx-4 mt-2 mb-4 bg-zinc-100/80 rounded-full h-10 flex items-center px-4 gap-2">
                    <Search className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs text-zinc-400 font-medium">Buscar transação...</span>
                </div>

                {/* 2. Menu Inferior - Grid Layout para garantir espaçamento */}
                <div className="grid grid-cols-5 items-end justify-items-center px-1 pb-1">

                    {/* 1. HOME */}
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 z-10 w-full">
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive('/dashboard') ? 'bg-black text-white shadow-lg shadow-black/20 scale-110' : 'text-zinc-400 hover:bg-zinc-50'
                            }`}>
                            <Home className="w-6 h-6 fill-current" />
                        </div>
                        {isActive('/dashboard') && <span className="text-[10px] font-bold text-black animate-in fade-in slide-in-from-bottom-1">Home</span>}
                    </Link>

                    {/* 2. EXTRATO */}
                    <Link href="/dashboard/transactions" className="flex flex-col items-center gap-1 z-10 w-full">
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive('/dashboard/transactions') ? 'bg-black text-white shadow-lg scale-110' : 'text-zinc-400 hover:bg-zinc-50'
                            }`}>
                            <List className="w-6 h-6" />
                        </div>
                    </Link>

                    {/* 3. AÇÃO CENTRAL (BOTÃO + GIGANTE) */}
                    {/* Container com largura fixa e z-index controlado */}
                    <div className="relative w-16 flex justify-center z-0 -top-6">
                        <div className="absolute inset-0 bg-blue-500 rounded-[2rem] blur-xl opacity-40"></div>
                        <div className="relative bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[1.8rem] w-16 h-14 flex items-center justify-center shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all hover:scale-105">
                            <div className="absolute inset-0 opacity-0 z-50 cursor-pointer">
                                <TransactionDialog spaceId={spaceId} />
                            </div>
                            <Plus className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* 4. CALENDÁRIO */}
                    <Link href="/calendario" className="flex flex-col items-center gap-1 z-10 w-full">
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive('/calendario') ? 'bg-black text-white shadow-lg scale-110' : 'text-zinc-400 hover:bg-zinc-50'
                            }`}>
                            <Calendar className="w-6 h-6" />
                        </div>
                    </Link>

                    {/* 5. PERFIL */}
                    <Link href="/settings" className="flex flex-col items-center gap-1 z-10 w-full">
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive('/settings') ? 'bg-black text-white shadow-lg scale-110' : 'text-zinc-400 hover:bg-zinc-50'
                            }`}>
                            <User className="w-6 h-6" />
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}