"use client";

import { Lightbulb, TrendingUp, PiggyBank } from "lucide-react";

const tips = [
    {
        icon: Lightbulb,
        title: "Diversifique",
        description: "Não coloque todos os ovos na mesma cesta. Varie entre Renda Fixa e Variável."
    },
    {
        icon: TrendingUp,
        title: "Longo Prazo",
        description: "O tempo é seu maior aliado. Mantenha a constância nos aportes."
    },
    {
        icon: PiggyBank,
        title: "Reserva de Emergência",
        description: "Antes de investir alto, garanta 6 meses de custo de vida em liquidez diária."
    }
];

export function InvestmentTips() {
    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4">Dicas do Investidor</h3>
            <div className="grid md:grid-cols-3 gap-4">
                {tips.map((tip, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                <tip.icon className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
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
