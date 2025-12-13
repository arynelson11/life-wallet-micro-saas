"use client";

import { PiggyBank, TrendingUp, Lock } from "lucide-react";

export function SavingsView() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="orvion-card p-8 bg-primary text-black col-span-1 md:col-span-3 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Patrimônio Líquido Acumulado</h3>
                    <p className="opacity-80">Total em todas as contas e investimentos</p>
                </div>
                <div className="text-5xl font-bold">R$ 152.400,00</div>
            </div>

            <div className="orvion-card p-6 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-pink-100 rounded-xl text-pink-600">
                        <PiggyBank className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold bg-pink-50 text-pink-700 px-2 py-1 rounded-full">Reserva</span>
                </div>
                <h3 className="text-zinc-500 mb-1">Reserva de Emergência</h3>
                <h2 className="text-2xl font-bold mb-4">R$ 25.000,00</h2>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-pink-500 w-[80%] h-full" />
                </div>
                <p className="text-xs text-zinc-400 mt-2">80% da meta</p>
            </div>

            <div className="orvion-card p-6 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Renda Fixa</span>
                </div>
                <h3 className="text-zinc-500 mb-1">Tesouro Direto</h3>
                <h2 className="text-2xl font-bold mb-4">R$ 45.000,00</h2>
                <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +1.2% este mês
                </div>
            </div>

            <div className="orvion-card p-6 hover:shadow-lg transition-all cursor-pointer opacity-75">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-zinc-100 rounded-xl text-zinc-600">
                        <Lock className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-1 rounded-full">Aposentadoria</span>
                </div>
                <h3 className="text-zinc-500 mb-1">Previdência Privada</h3>
                <h2 className="text-2xl font-bold mb-4">R$ 82.400,00</h2>
                <p className="text-xs text-zinc-400">Disponível em 2045</p>
            </div>
        </div>
    );
}
