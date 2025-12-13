"use client";

import { Calendar } from "@/components/ui/calendar"; // Assuming we want a calendar view or just a summary
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"; // Assuming table component exists or I will verify availability, if not I use div

export function MonthlyView() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="orvion-card p-8">
                <h2 className="text-2xl font-bold mb-6">Resumo de Dezembro</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-zinc-50 rounded-xl">
                        <p className="text-zinc-500 text-sm">Entradas</p>
                        <p className="text-xl font-bold text-green-600">R$ 12.500</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-xl">
                        <p className="text-zinc-500 text-sm">Saídas</p>
                        <p className="text-xl font-bold text-red-600">R$ 8.200</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-xl">
                        <p className="text-zinc-500 text-sm">Investido</p>
                        <p className="text-xl font-bold text-blue-600">R$ 2.000</p>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-xl text-white">
                        <p className="text-zinc-400 text-sm">Saldo Final</p>
                        <p className="text-xl font-bold">+ R$ 2.300</p>
                    </div>
                </div>

                <h3 className="font-bold mb-4">Extrato do Mês</h3>
                <div className="border rounded-xl">
                    {/* Simplified Table Structure since Table components might not be setup or I want to be safe */}
                    <div className="grid grid-cols-1 divide-y">
                        {[
                            { day: "12/12", desc: "Pagamento Cliente A", cat: "Receita", val: "+ 2.500,00", color: "text-green-600" },
                            { day: "10/12", desc: "Supermercado Extra", cat: "Alimentação", val: "- 450,00", color: "text-red-600" },
                            { day: "05/12", desc: "Aluguel", cat: "Moradia", val: "- 2.000,00", color: "text-red-600" },
                        ].map((t, i) => (
                            <div key={i} className="flex justify-between p-4 hover:bg-zinc-50">
                                <span className="text-zinc-500 font-mono text-sm w-16">{t.day}</span>
                                <span className="flex-1 font-medium">{t.desc}</span>
                                <span className="text-sm text-zinc-400 w-32 hidden md:block">{t.cat}</span>
                                <span className={`font-bold ${t.color}`}>{t.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AnnualView() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="orvion-card p-8">
                <h2 className="text-2xl font-bold mb-6">Panorama 2025</h2>
                <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-zinc-200 pb-2">
                    {[30, 45, 32, 50, 60, 40, 70, 65, 55, 60, 80, 75].map((h, i) => (
                        <div key={i} className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                R$ {h}k
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-4 mt-2 text-xs text-zinc-500 font-mono">
                    <span>JAN</span><span>FEV</span><span>MAR</span><span>ABR</span><span>MAI</span><span>JUN</span>
                    <span>JUL</span><span>AGO</span><span>SET</span><span>OUT</span><span>NOV</span><span>DEZ</span>
                </div>
            </div>
        </div>
    );
}
