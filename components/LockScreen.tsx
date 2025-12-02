'use client'

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/stripe";
import { Check, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

const plans = [
    {
        name: "Solo",
        price: "R$ 29,90",
        period: "/mês",
        description: "Para quem quer organização individual.",
        features: ["Gestão de Receitas e Despesas", "Metas Ilimitadas", "Relatórios Básicos"],
        priceId: "price_1Q...", // Placeholder, user needs to fill
        highlight: false
    },
    {
        name: "Casal",
        price: "R$ 49,90",
        period: "/mês",
        description: "Perfeito para organizar a vida a dois.",
        features: ["Tudo do Solo", "Gestão Compartilhada", "Chat Financeiro", "Metas em Conjunto"],
        priceId: "price_1Q...", // Placeholder
        highlight: true
    },
    {
        name: "Família",
        price: "R$ 89,90",
        period: "/mês",
        description: "Gestão completa para toda a família.",
        features: ["Até 5 membros", "Múltiplos Espaços", "Relatórios Avançados", "Consultoria IA Premium"],
        priceId: "price_1Q...", // Placeholder
        highlight: false
    }
];

export function LockScreen() {
    return (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-5xl w-full space-y-8 text-center py-10">
                <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                        <Lock className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Seu teste gratuito acabou 🔒
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Para continuar organizando suas finanças e alcançando suas metas, escolha um plano que se adapta a você.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`p-6 relative flex flex-col ${plan.highlight
                                    ? 'bg-zinc-900 border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-105 z-10'
                                    : 'bg-zinc-950 border-zinc-800'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    Mais Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-zinc-500">{plan.period}</span>
                                </div>
                                <p className="text-zinc-400 text-sm mt-2">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                                        <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => createCheckoutSession(plan.priceId)}
                                className={`w-full font-bold ${plan.highlight
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                                    }`}
                            >
                                Assinar Agora
                            </Button>
                        </Card>
                    ))}
                </div>

                <p className="text-zinc-500 text-sm">
                    Cancele a qualquer momento. Pagamento seguro via Stripe.
                </p>
            </div>
        </div>
    );
}
