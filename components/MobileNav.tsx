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
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-4 pt-2 px-4 pointer-events-none flex justify-center w-full">
            {/* Container Principal "Native Dock" */}
            <div className="pointer-events-auto w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 p-2 relative">

                {/* Grid Layout 5 Colunas Fixo */}
                <div className="grid grid-cols-5 items-center h-16 relative">

                    {/* 1. HOME */}
                    <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive('/dashboard') ? 'bg-black text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}>
                            <Home className="w-6 h-6 fill-current" />
                        </div>
                    </Link>

                    {/* 2. EXTRATO */}
                    <Link href="/dashboard/transactions" className="flex flex-col items-center justify-center w-full h-full">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive('/dashboard/transactions') ? 'bg-black text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}>
                            <List className="w-6 h-6" />
                        </div>
                    </Link>

                    {/* 3. AÇÃO CENTRAL (BOTÃO +) */}
                    <div className="relative flex justify-center items-center -top-6">
                        <div className="absolute w-14 h-14 bg-blue-500 rounded-full blur-xl opacity-40"></div>
                        <div className="relative w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transform active:scale-95 transition-all hover:scale-105 z-50">
                            <div className="absolute inset-0 opacity-0 cursor-pointer">
                                <TransactionDialog spaceId={spaceId} />
                            </div>
                            <Plus className="w-7 h-7 text-white" />
                        </div>
                    </div>

                    {/* 4. CALENDÁRIO */}
                    <Link href="/calendario" className="flex flex-col items-center justify-center w-full h-full">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive('/calendario') ? 'bg-black text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}>
                            <Calendar className="w-6 h-6" />
                        </div>
                    </Link>

                    {/* 5. PERFIL */}
                    <Link href="/settings" className="flex flex-col items-center justify-center w-full h-full">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive('/settings') ? 'bg-black text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}>
                            <User className="w-6 h-6" />
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}