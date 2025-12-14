"use client";

import { Lightbulb, TrendingUp, PiggyBank, AlertTriangle, PieChart, Info } from "lucide-react";

interface Asset {
    id: string;
    name: string;
    category: string;
    amount: number;
}

interface InvestmentTipsProps {
    assets?: Asset[]; // Optional prop
}

export function InvestmentTips({ assets = [] }: InvestmentTipsProps) {

    const generateTips = () => {
        const tips = [];
        const totalValue = assets.reduce((acc, curr) => acc + curr.amount, 0);

        // Category Analysis
        const cryptoAssets = assets.filter(a => a.category === 'Cripto');
        const cryptoTotal = cryptoAssets.reduce((acc, curr) => acc + curr.amount, 0);
        const cryptoAllocation = totalValue > 0 ? (cryptoTotal / totalValue) : 0;

        const fiisAssets = assets.filter(a => a.category === 'FIIs');

        // Rule 1: High Volatility Alert
        if (cryptoAllocation > 0.5) {
            tips.push({
                icon: AlertTriangle,
                title: "Alta Volatilidade",
                description: "Mais de 50% da sua carteira está em Cripto. Considere rebalancear com Renda Fixa para segurança.",
                color: "text-amber-500"
            });
        }

        // Rule 2: Diversification Check
        if (assets.length > 0 && assets.length < 3) {
            tips.push({
                icon: PieChart,
                title: "Diversifique Mais",
                description: "Você tem poucos ativos. A regra de ouro é não colocar todos os ovos na mesma cesta.",
                color: "text-blue-500"
            });
        }

        // Rule 3: Income Generation
        if (fiisAssets.length === 0 && assets.length > 0) {
            tips.push({
                icon: TrendingUp,
                title: "Renda Passiva",
                description: "Que tal adicionar FIIs? Eles pagam dividendos mensais isentos de IR.",
                color: "text-green-500"
            });
        }

        // Default Tips if list is small or empty
        if (tips.length < 3) {
            const dayOfWeek = new Date().getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                tips.push({
                    icon: TrendingUp,
                    title: "Mercado Aberto",
                    description: "Dia útil! Ótimo momento para buscar oportunidades na Bolsa (B3).",
                    color: "text-primary"
                });
            } else {
                tips.push({
                    icon: Info,
                    title: "Estude no Fim de Semana",
                    description: "Mercado fechado. Aproveite para ler relatórios e planejar a semana.",
                    color: "text-zinc-400"
                });
            }

            if (tips.length < 3) {
                tips.push({
                    icon: PiggyBank,
                    title: "Reserva de Emergência",
                    description: "Antes de investir alto, garanta 6 meses de custo de vida em liquidez diária.",
                    color: "text-white"
                });
            }
        }

        return tips.slice(0, 3); // Return max 3 tips
    };

    const tips = generateTips();

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4">Dicas Inteligentes</h3>
            <div className="grid md:grid-cols-3 gap-4">
                {tips.map((tip, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                <tip.icon className={`w-5 h-5 ${tip.color || 'text-zinc-400'} group-hover:text-primary transition-colors`} />
                            </div>
                            <h4 className="font-bold text-white text-sm">{tip.title}</h4>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            {tip.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
