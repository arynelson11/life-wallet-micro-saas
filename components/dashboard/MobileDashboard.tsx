
"use client";

import { useState } from "react";
import {
    Bell,
    User,
    Eye,
    EyeOff,
    ArrowUpRight,
    Barcode,
    Plus,
    CreditCard,
    ArrowRight,
    TrendingUp,
    ArrowDownRight,
    Home,
    Search,
    Wallet
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileDashboardProps {
    summary: any;
    transactions: any[];
    user: any;
    profile: any;
    onNavigate: (tab: string) => void;
}

export function MobileDashboard({ summary, transactions = [], user, profile, onNavigate }: MobileDashboardProps) {
    const [showBalance, setShowBalance] = useState(true);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário';

    return (
        <div className="md:hidden min-h-screen bg-black text-white pb-32 animate-fade-in-up">

            {/* 1. HEADER "CLEAN" */}
            <div className="flex justify-between items-center p-6 bg-black sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-zinc-800">
                        <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-xs">Olá,</span>
                        <span className="font-bold text-white text-base">{firstName}</span>
                    </div>
                </div>
                <button className="relative p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-zinc-900"></span>
                </button>
            </div>

            <div className="px-6 space-y-8">

                {/* 2. POWER CARD */}
                <div className="w-full aspect-[1.8] rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-zinc-900 p-6 flex flex-col justify-between shadow-2xl shadow-purple-900/20 relative overflow-hidden group">

                    {/* Background Noise/Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-10 -translate-y-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl -translate-x-5 translate-y-5" />

                    <div className="relative z-10 flex justify-between items-start">
                        <span className="text-white/80 text-sm font-medium tracking-wide">Saldo Total</span>
                        <button onClick={() => setShowBalance(!showBalance)} className="text-white/70 hover:text-white">
                            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="relative z-10">
                        {showBalance ? (
                            <h1 className="text-4xl font-bold text-white tracking-tight">
                                <span className="text-lg font-medium text-white/60 mr-1">R$</span>
                                {formatCurrency(summary.balance).replace('R$', '').trim()}
                            </h1>
                        ) : (
                            <div className="h-10 w-48 bg-white/10 rounded-xl animate-pulse backdrop-blur-sm" />
                        )}
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                        {/* Sparkline Decorative */}
                        <div className="h-8 w-24 flex items-end gap-1">
                            {[40, 60, 45, 70, 50, 80, 75].map((h, i) => (
                                <div key={i} style={{ height: `${h}%` }} className="w-2 bg-white/20 rounded-t-sm" />
                            ))}
                        </div>
                        <span className="text-xs text-emerald-300 font-medium bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            + 12% este mês
                        </span>
                    </div>
                </div>

                {/* 3. QUICK ACTIONS */}
                <div className="flex justify-between px-2">
                    {[
                        { icon: ArrowUpRight, label: "Pix", action: () => { } },
                        { icon: ArrowRight, label: "Transferir", action: () => { } },
                        { icon: CreditCard, label: "Cartões", action: () => onNavigate("credit-card") },
                        { icon: Plus, label: "Mais", action: () => onNavigate("overview") }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 cursor-pointer" onClick={item.action}>
                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 shadow-lg active:scale-95 transition-transform">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <span className="text-xs text-zinc-400 font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* 4. LISTA DE TRANSAÇÕES (FEED) */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Atividade Recente</h3>
                        <button onClick={() => onNavigate("monthly")} className="text-xs text-purple-400 font-medium">Ver tudo</button>
                    </div>

                    <div className="space-y-3">
                        {transactions.slice(0, 5).map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl border border-zinc-700/50">
                                        {t.category === 'Alimentação' ? '🍔' :
                                            t.category === 'Moradia' ? '🏠' :
                                                t.category === 'Transporte' ? '🚗' :
                                                    t.category === 'Lazer' ? '🎉' :
                                                        t.type === 'income' ? '💰' : '💸'}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{t.description || t.category}</p>
                                        <p className="text-zinc-500 text-xs mt-0.5 capitalize">{format(new Date(t.date), "d MMM", { locale: ptBR })}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-zinc-100'}`}>
                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount).replace('R$', '').trim()}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center text-zinc-600 py-8 text-sm italic">Nenhuma atividade recente.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
