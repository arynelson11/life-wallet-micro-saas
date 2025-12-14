"use client";

import { createCheckoutSession, createCustomerPortalSession } from "@/app/actions/stripe";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, ExternalLink, Zap } from "lucide-react";

interface SubscriptionTabProps {
    profile: any;
    isStripeConfigured: boolean;
}

export function SubscriptionTab({ profile, isStripeConfigured }: SubscriptionTabProps) {
    const isActive = profile?.subscription_status === 'active';
    const planName = profile?.plan_type || 'FREE';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Assinatura & Planos</h2>
                <p className="text-zinc-400 text-sm">Gerencie seu plano atual e método de pagamento.</p>
            </div>

            {/* Current Plan Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-white/10 p-8 group">
                {/* Glow Effect */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-30 ${isActive ? 'bg-primary' : 'bg-red-500'}`} />

                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-xl backdrop-blur-md border border-white/5 ${isActive ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
                                <Zap className="w-6 h-6" />
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-wider py-1 px-3 rounded-full border ${isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-zinc-800 text-zinc-400 border-white/5'}`}>
                                {isActive ? 'Ativo' : 'Inativo / Cancelado'}
                            </span>
                        </div>

                        <h3 className="text-4xl font-bold text-white mb-2">Plano {planName}</h3>
                        <p className="text-zinc-400 max-w-xs text-sm leading-relaxed">
                            {isActive
                                ? "Sua assinatura está ativa! Aproveite todos os recursos ilimitados."
                                : "Faça o upgrade para desbloquear todos os recursos e inteligência artificial."
                            }
                        </p>

                        {isActive && (
                            <div className="mt-6 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-sm text-zinc-300">
                                    <Check className="w-4 h-4 text-primary" /> <span>Dashboard Ilimitado</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-300">
                                    <Check className="w-4 h-4 text-primary" /> <span>IA Financeira</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center gap-4 min-w-[200px]">
                        {!isStripeConfigured && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                                ⚠️ Stripe não configurado. Adicione chaves no .env
                            </div>
                        )}

                        {!isActive ? (
                            <Button
                                className="w-full h-12 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(74,222,128,0.3)] transition-all"
                                disabled={!isStripeConfigured}
                                onClick={async () => {
                                    if (!isStripeConfigured) return;
                                    await createCheckoutSession("price_1Q...");
                                }}
                            >
                                Fazer Upgrade <Zap className="w-4 h-4 ml-2 fill-black" />
                            </Button>
                        ) : (
                            <form action={createCustomerPortalSession}>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 hover:text-white transition-all group-hover:border-white/20"
                                    disabled={!isStripeConfigured}
                                >
                                    Gerenciar Assinatura <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                                </Button>
                            </form>
                        )}

                        {isActive && (
                            <button className="text-xs text-red-400 hover:text-red-300 transition-colors text-center mt-2 underline opacity-0 group-hover:opacity-100 duration-500">
                                Cancelar Assinatura
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
