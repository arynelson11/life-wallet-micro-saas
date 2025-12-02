'use client'

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plane, Car, Home, GraduationCap, Shield, Star, Plus, Trash2, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Função de ícones (reutilizada)
const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'plane': return <Plane className="h-8 w-8 text-blue-600" />;
        case 'car': return <Car className="h-8 w-8 text-blue-600" />;
        case 'home': return <Home className="h-8 w-8 text-blue-600" />;
        case 'education': return <GraduationCap className="h-8 w-8 text-blue-600" />;
        case 'safety': return <Shield className="h-8 w-8 text-blue-600" />;
        default: return iconName?.match(/\p{Emoji}/u) ? <span className="text-4xl">{iconName}</span> : <Star className="h-8 w-8 text-blue-600" />;
    }
};

const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function GoalDetailsDialog({ goal, children }: { goal: any, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [addAmount, setAddAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
    const remaining = goal.target_amount - goal.current_amount;

    // Função para Adicionar Dinheiro à Meta
    const handleDeposit = async () => {
        if (!addAmount) return;
        setLoading(true);

        const newAmount = Number(goal.current_amount) + Number(addAmount);

        const { error } = await supabase
            .from('goals')
            .update({ current_amount: newAmount })
            .eq('id', goal.id);

        if (!error) {
            setAddAmount("");
            setOpen(false);
            router.refresh();
        }
        setLoading(false);
    };

    // Função para Deletar Meta
    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir esta meta?")) return;
        await supabase.from('goals').delete().eq('id', goal.id);
        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                    {children}
                </div>
            </DialogTrigger>

            {/* O Design do Card começa aqui */}
            <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md w-full">
                <div className="w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl">

                    {/* 1. TOPO (THEME LIGHT) */}
                    <div className="p-8 bg-white relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                {getIcon(goal.icon)}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleDelete} className="p-2 rounded-full hover:bg-red-50 text-red-400 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 text-xs font-bold uppercase tracking-wider flex items-center">
                                    Ativo
                                </div>
                            </div>
                        </div>

                        <div>
                            <DialogTitle className="text-2xl font-bold text-zinc-900">{goal.title}</DialogTitle>
                            <p className="text-zinc-400 text-sm font-medium mt-1">Alvo total</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-bold text-blue-900">{formatCurrency(goal.target_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. BASE (THEME DARK / GRADIENT) */}
                    <div className="p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative overflow-hidden">
                        {/* Efeito de Glow no fundo */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-1">Progresso Atual</p>
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        {progress.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-zinc-400 text-xs">Falta apenas</p>
                                    <p className="text-white font-bold text-lg">{formatCurrency(remaining)}</p>
                                </div>
                            </div>

                            {/* Barra de Progresso Customizada (Slider Style) */}
                            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden mb-8 relative">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-white transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                >
                                    {/* Brilho na ponta da barra */}
                                    <div className="absolute right-0 top-0 h-full w-2 bg-white blur-[2px] shadow-[0_0_10px_white]"></div>
                                </div>
                            </div>

                            {/* Área de Depósito Rápido */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex gap-2 backdrop-blur-sm">
                                <input
                                    type="number"
                                    placeholder="R$ 0,00"
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(e.target.value)}
                                    className="bg-transparent border-none text-white placeholder:text-zinc-500 px-4 w-full focus:outline-none font-bold"
                                />
                                <Button
                                    onClick={handleDeposit}
                                    disabled={loading || !addAmount}
                                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 font-bold shadow-lg shadow-blue-500/20"
                                >
                                    {loading ? "..." : <Plus className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}