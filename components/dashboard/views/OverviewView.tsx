"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, TrendingUp, Wallet, ArrowDownRight, CreditCard, DollarSign, PiggyBank, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OverviewViewProps {
    summary: {
        balance: number;
        income: number;
        expenses: number;
        fixedExpenses: number;
        variableExpenses: number;
        incomeChartData: { name: string; value: number }[];
        debt: { total: number; paid: number };
        cards: { id: string; name: string; limit: number; used: number; color: string }[];
        assets: { total: number; fixed: number; variable: number; goalsCount: number };
        investments?: { total: number; fixed: number; variable: number; count: number };
    };
    onTabChange: (tab: string) => void;
}

export function OverviewView({ summary, onTabChange }: OverviewViewProps) {

    const router = useRouter();

    const handleGenerateReport = () => {
        toast.success("Relatório solicitado!", {
            description: "Enviaremos o PDF para seu email em instantes.",
        });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    // Shared Card Styles (DRY)
    const cardBaseClass = "orvion-card relative w-full overflow-hidden flex flex-col justify-between transition-all duration-300 border border-zinc-800 bg-[#09090b] md:bg-zinc-950/50 hover:border-zinc-700 p-5 md:p-6 min-h-[220px] md:min-h-[260px]";

    return (
        <div className="space-y-6 pb-24 md:pb-12 animate-fade-in-up">

            {/* Action Bar */}
            <div className="flex justify-end px-1">
                <Button
                    className="rounded-full gap-2 font-semibold bg-[#CCF381] text-black hover:bg-[#b0d668] transition-colors"
                    onClick={handleGenerateReport}
                >
                    <ArrowUpRight className="w-4 h-4" />
                    Gerar Relatório
                </Button>
            </div>

            {/* MAIN METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

                {/* 1. Saldo Geral */}
                <div className={cardBaseClass}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 text-[#CCF381]">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Saldo Geral</h3>
                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Acumulado</p>
                        </div>
                    </div>

                    <div className="space-y-2 relative z-10">
                        <span className={cn(
                            "text-3xl md:text-4xl font-bold tracking-tight block truncate",
                            summary.balance >= 0 ? "text-white" : "text-red-500"
                        )}>
                            {formatCurrency(summary.balance)}
                        </span>
                        <p className="text-sm text-zinc-400 line-clamp-1">
                            Saldo consolidado de todas as contas.
                        </p>
                    </div>

                    <div className="w-full bg-zinc-900/50 rounded-full h-1.5 mt-6 overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-1000", summary.balance >= 0 ? "bg-[#CCF381]" : "bg-red-500")}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

                {/* 2. Receitas */}
                <div
                    className={cn(cardBaseClass, "cursor-pointer group")}
                    onClick={() => onTabChange("earnings")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Receitas</h3>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Este Mês</p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                    </div>

                    <span className="text-3xl md:text-3xl font-bold text-white tracking-tight truncate block mb-4">
                        {formatCurrency(summary.income)}
                    </span>

                    <div className="h-[80px] w-full -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={summary.incomeChartData}>
                                <defs>
                                    <linearGradient id="colorEarningsOverview" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#colorEarningsOverview)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Despesas */}
                <div
                    className={cn(cardBaseClass, "cursor-pointer group")}
                    onClick={() => onTabChange("variable-expenses")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/10 group-hover:bg-red-500/20 transition-colors">
                                <ArrowDownRight className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Despesas</h3>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Fixas + Variáveis</p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-red-500 transition-colors" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Fixas</p>
                                <span className="text-xl font-bold text-orange-400 truncate block">{formatCurrency(summary.fixedExpenses)}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-zinc-500 mb-1">Variáveis</p>
                                <span className="text-xl font-bold text-purple-400 truncate block">{formatCurrency(summary.variableExpenses)}</span>
                            </div>
                        </div>

                        <div className="w-full flex h-2 rounded-full overflow-hidden bg-zinc-900">
                            <div className="h-full bg-orange-400" style={{ width: `${(summary.fixedExpenses / (summary.expenses || 1)) * 100}%` }} />
                            <div className="h-full bg-purple-400" style={{ width: `${(summary.variableExpenses / (summary.expenses || 1)) * 100}%` }} />
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-zinc-500">Total: <span className="text-white font-medium">{formatCurrency(summary.expenses)}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECONDARY METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

                {/* 4. Dívidas */}
                <div
                    className={cn(cardBaseClass, "hover:border-rose-500/30 cursor-pointer")}
                    onClick={() => onTabChange("debts")}
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center border border-rose-500/10">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-white">Dívidas</h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center py-4">
                        {summary.debt.total > 0 ? (
                            <div className="relative h-24 w-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[{ value: summary.debt.paid }, { value: summary.debt.total - summary.debt.paid }]}
                                            innerRadius={30}
                                            outerRadius={40}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <Cell fill="#f43f5e" />
                                            <Cell fill="#27272a" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-rose-500">
                                    {Math.round((summary.debt.paid / summary.debt.total) * 100)}%
                                </div>
                            </div>
                        ) : (
                            <span className="text-zinc-500 font-medium">Sem dívidas! 🎉</span>
                        )}
                    </div>
                    <p className="text-center text-sm text-zinc-400 font-medium mt-auto">
                        Restante: {formatCurrency(summary.debt.total - summary.debt.paid)}
                    </p>
                </div>

                {/* 5. Cartões */}
                <div
                    className={cn(cardBaseClass, "hover:border-blue-500/30 cursor-pointer")}
                    onClick={() => onTabChange("credit-card")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/10">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-base text-white">Cartões</h3>
                        </div>
                        <span className="text-sm font-bold bg-zinc-900 px-3 py-1 rounded-lg text-white border border-zinc-800">
                            {formatCurrency(summary.cards.reduce((acc, c) => acc + c.used, 0))}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                        {summary.cards.length === 0 ? (
                            <p className="text-zinc-500 text-sm text-center py-4">Nenhum cartão</p>
                        ) : (
                            summary.cards.slice(0, 3).map((card, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-300 truncate max-w-[100px]">{card.name}</span>
                                        <span className="text-zinc-500">{Math.round((card.used / card.limit) * 100)}%</span>
                                    </div>
                                    <Progress value={(card.used / card.limit) * 100} className="h-1.5 bg-zinc-900" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 6. Metas */}
                <div
                    className={cn(cardBaseClass, "bg-[#CCF381] border-[#CCF381] text-black hover:opacity-90 cursor-pointer")}
                    onClick={() => router.push("/metas")}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-black/10 text-black rounded-xl flex items-center justify-center">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-black">Metas</h3>
                            <p className="text-xs text-black/60 font-medium uppercase">Meus Sonhos</p>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <span className="text-3xl font-bold tracking-tight block truncate mb-2">
                            {formatCurrency(summary.assets.total)}
                        </span>
                        <div className="flex items-center gap-2 text-sm font-medium text-black/70">
                            <PiggyBank className="w-4 h-4" />
                            <span>{summary.assets.goalsCount} Objetivos ativos</span>
                        </div>
                    </div>
                </div>

                {/* 7. Carteira de Investimentos */}
                <div
                    className={cn(cardBaseClass, "bg-black border-zinc-800 hover:border-purple-500/50 cursor-pointer")}
                    onClick={() => onTabChange("savings")}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-zinc-900 text-purple-500 rounded-xl flex items-center justify-center border border-zinc-800">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-white">Investimentos</h3>
                            <p className="text-xs text-zinc-500 font-medium uppercase">Patrimônio</p>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <span className="text-3xl lg:text-3xl font-bold tracking-tight text-white block truncate mb-4">
                            {formatCurrency(summary.investments?.total || 0)}
                        </span>

                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <span className="text-zinc-400">Renda Fixa</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-zinc-400">Variável</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

