"use client";

import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TransactionDialog } from "@/components/dashboard/TransactionDialog";

export function DebtsView() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <TransactionDialog type="debt" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="orvion-card p-8 border-l-4 border-red-500">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold">Dívida Total</h3>
                            <p className="text-zinc-500">Montante restante a pagar</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full text-red-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-8">R$ 12.500,00</h2>

                    <h4 className="font-semibold mb-2 text-sm">Progresso de Quitação Global</h4>
                    <Progress value={35} className="h-3 bg-zinc-100" />
                    <p className="text-right text-xs text-muted-foreground mt-2">35% Pago</p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-4">Detalhamento</h3>
                    {[
                        { name: "Empréstimo Pessoal", total: 10000, paid: 2500, color: "bg-red-500" },
                        { name: "Financiamento Carro", total: 45000, paid: 15000, color: "bg-orange-500" },
                    ].map((debt, i) => (
                        <div key={i} className="orvion-card p-6">
                            <div className="flex justify-between mb-4">
                                <span className="font-bold">{debt.name}</span>
                                <span className="text-zinc-500">R$ {debt.total - debt.paid} restantes</span>
                            </div>
                            <Progress value={(debt.paid / debt.total) * 100} className="h-2" />
                            <div className="flex justify-between mt-2 text-xs text-zinc-400">
                                <span>0%</span>
                                <span>{Math.round((debt.paid / debt.total) * 100)}% Pago</span>
                            </div>
                        </div>
                    ))}

                    <div className="orvion-card p-6 bg-green-50 border border-green-200 flex items-center gap-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <div>
                            <h4 className="font-bold text-green-900">Parabéns!</h4>
                            <p className="text-green-700 text-sm">Você quitou seu cartão de crédito mês passado!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
