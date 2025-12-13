"use client";

import { CreditCard, CalendarClock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function CreditCardView() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in-up">
            {/* Visual Cartão */}
            <div className="md:col-span-5">
                <div className="w-full aspect-[1.586] bg-gradient-to-br from-zinc-900 to-black rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex justify-between items-start">
                        <img src="/chip.png" alt="Chip" className="w-12 h-10 object-contain opacity-80 bg-yellow-200/20 rounded-md" />
                        {/* Fallback styling for chip if image missing in dev */}
                        <span className="font-mono text-xl tracking-widest">LifeWallet Black</span>
                    </div>

                    <div className="relative z-10">
                        <p className="font-mono text-2xl tracking-widest mb-4">**** **** **** 4829</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-zinc-400 uppercase mb-1">Titular</p>
                                <p className="font-medium tracking-wide">RICARDO O SILVA</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 uppercase mb-1">Validade</p>
                                <p className="font-medium tracking-wide">12/29</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Limite Utilizado</span>
                        <span className="text-sm text-zinc-500">R$ 3.450 / R$ 10.000</span>
                    </div>
                    <Progress value={34.5} className="h-3" />
                </div>
            </div>

            {/* Fatura */}
            <div className="md:col-span-7 space-y-6">
                <div className="orvion-card p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-primary/20 rounded-xl text-primary-dark">
                            <CalendarClock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Fatura Atual</h3>
                            <p className="text-zinc-500">Vence em 15 Dez</p>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-8">
                        <h2 className="text-5xl font-bold">R$ 3.450,90</h2>
                        <span className="text-zinc-400">fechada</span>
                    </div>

                    <div className="flex gap-4">
                        <Button className="flex-1 h-12 rounded-xl text-lg font-bold">Pagar Fatura</Button>
                        <Button variant="outline" className="flex-1 h-12 rounded-xl text-lg">Parcelar</Button>
                    </div>
                </div>

                <div className="orvion-card p-6">
                    <h3 className="font-bold mb-4">Últimas Compras</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Netflix", date: "Ontem", value: "55,90" },
                            { name: "Uber", date: "12 Dez", value: "24,90" },
                            { name: "Restaurante japonês", date: "10 Dez", value: "189,00" },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-zinc-400">{item.date}</p>
                                    </div>
                                </div>
                                <span className="font-bold">R$ {item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
