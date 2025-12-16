'use client'

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plane, Car, Home, GraduationCap, Shield, Star, Plus, Trash2, ArrowUpRight, Pencil } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { GoalForm } from "@/components/dashboard/forms/GoalForm";

// Função de ícones (reutilizada)
const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'plane': return <Plane className="h-8 w-8 text-emerald-500" />;
        case 'car': return <Car className="h-8 w-8 text-emerald-500" />;
        case 'home': return <Home className="h-8 w-8 text-emerald-500" />;
        case 'education': return <GraduationCap className="h-8 w-8 text-emerald-500" />;
        case 'safety': return <Shield className="h-8 w-8 text-emerald-500" />;
        default: return iconName?.match(/\p{Emoji}/u) ? <span className="text-4xl">{iconName}</span> : <Star className="h-8 w-8 text-emerald-500" />;
    }
};

const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function GoalDetailsDialog({ goal, spaceId, children }: { goal: any, spaceId?: string, children: React.ReactNode }) {
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
                <div className="w-full bg-zinc-950 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800">
                    {/* 1. TOPO (THEME DARK) */}
                    <div className="relative h-64 bg-zinc-900/50 overflow-hidden">
                        {goal.image_url ? (
                            <div className="absolute inset-0">
                                <img
                                    src={goal.image_url}
                                    alt={goal.title}
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 to-transparent"></div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
                        )}

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
                                    {getIcon(goal.icon)}
                                </div>
                                <div className="flex gap-2">
                                    {/* Edit Button */}
                                    {spaceId && (
                                        <GoalForm
                                            initialData={goal}
                                            spaceId={spaceId}
                                            trigger={
                                                <button className="p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white/80 hover:text-white transition-all border border-white/10">
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                            }
                                        />
                                    )}
                                    <button onClick={handleDelete} className="p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-red-500/20 text-white/80 hover:text-red-400 transition-all border border-white/10">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center border border-emerald-500/30">
                                        Ativo
                                    </div>
                                </div>
                            </div>

                            <div>
                                <DialogTitle className="text-3xl font-bold text-white shadow-black/50 drop-shadow-lg">{goal.title}</DialogTitle>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <p className="text-white/60 text-sm font-medium mr-1">Alvo:</p>
                                    <span className="text-2xl font-bold text-emerald-400 drop-shadow-md">{formatCurrency(goal.target_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. BASE (THEME DARK / GRADIENT) */}
                    <div className="p-8 bg-gradient-to-br from-zinc-950 to-black relative overflow-hidden">
                        {/* Efeito de Glow no fundo */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Progresso Atual</p>
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        {progress.toFixed(0)}%
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-xs text-right">Acumulado / Meta</p>
                                <p className="text-white font-bold text-lg text-right">
                                    <span className="text-emerald-400">{formatCurrency(goal.current_amount)}</span>
                                    <span className="text-zinc-600 mx-1">/</span>
                                    <span className="text-zinc-400">{formatCurrency(goal.target_amount)}</span>
                                </p>
                            </div>
                        </div>

                        {/* Barra de Progresso Customizada (Slider Style) */}
                        <div className="h-6 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden mb-8 relative shadow-inner">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                                style={{ width: `${progress}%` }}
                            >
                                {/* Brilho e Partículas */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                <div className="h-full w-1 bg-white/50 blur-[1px]"></div>
                            </div>
                        </div>

                        {/* Área de Depósito Rápido */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider ml-1">Guardar Dinheiro</label>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 flex gap-2 shadow-lg focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
                                <input
                                    type="number"
                                    placeholder="Quanto você vai guardar hoje?"
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(e.target.value)}
                                    className="bg-transparent border-none text-white placeholder:text-zinc-600 px-4 w-full focus:outline-none font-bold input-number-no-arrow"
                                />
                                <Button
                                    onClick={handleDeposit}
                                    disabled={loading || !addAmount}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 font-bold shadow-lg shadow-emerald-500/20"
                                >
                                    {loading ? "Salvando..." : (
                                        <>
                                            Adicionar <Plus className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}