"use client";

import { CreditCard, CalendarClock, Plus, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Card {
    id: number;
    name: string;
    holder: string;
    finalDigits: string;
    expiry: string;
    color: string;
    bgGradient: string;
    brandLogo?: string; // We'll use color/text for now as SVG logos
    limit: number;
    used: number;
}

const cards: Card[] = [
    {
        id: 1,
        name: "Nubank Platinum",
        holder: "RICARDO SILVA",
        finalDigits: "4829",
        expiry: "09/29",
        color: "#820ad1",
        bgGradient: "from-[#820ad1] to-[#400080]",
        limit: 10000,
        used: 3450
    },
    {
        id: 2,
        name: "Inter Gold",
        holder: "RICARDO SILVA",
        finalDigits: "9921",
        expiry: "12/28",
        color: "#ff7a00",
        bgGradient: "from-[#ff7a00] to-[#ff4d00]",
        limit: 5000,
        used: 1200
    },
    {
        id: 3,
        name: "XP Visa Infinite",
        holder: "RICARDO SILVA",
        finalDigits: "1022",
        expiry: "05/30",
        color: "#000000",
        bgGradient: "from-[#111] to-[#000]",
        limit: 50000,
        used: 15400
    }
];

export function CreditCardView() {
    const [selectedCardId, setSelectedCardId] = useState(cards[0].id);
    const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Meus Cartões</h2>
                <Button className="rounded-full gap-2 font-semibold">
                    <Plus className="w-4 h-4" />
                    Adicionar Cartão
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Visual Cartão - Carousel */}
                <div className="md:col-span-5 space-y-6">
                    {/* Main Displayed Card */}
                    <div
                        className={cn(
                            "w-full aspect-[1.586] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500",
                            `bg-gradient-to-br ${selectedCard.bgGradient}`
                        )}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 flex justify-between items-start">
                            {/* Mock Chip */}
                            <div className="w-12 h-10 bg-yellow-200/20 backdrop-blur-sm rounded-md border border-white/20 flex items-center justify-center">
                                <div className="w-8 h-6 border border-white/30 rounded-sm" />
                            </div>
                            <span className="font-mono text-xl tracking-widest font-bold italic opacity-80">{selectedCard.name.split(" ")[0]}</span>
                        </div>

                        <div className="relative z-10">
                            <p className="font-mono text-xl md:text-2xl tracking-widest mb-6 drop-shadow-md">
                                **** **** **** {selectedCard.finalDigits}
                            </p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] uppercase opacity-75 mb-1">Titular</p>
                                    <p className="font-medium tracking-wide text-sm md:text-base">{selectedCard.holder}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase opacity-75 mb-1">Validade</p>
                                    <p className="font-medium tracking-wide text-sm md:text-base">{selectedCard.expiry}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Selector Loop */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                        {cards.map(card => (
                            <div
                                key={card.id}
                                onClick={() => setSelectedCardId(card.id)}
                                className={cn(
                                    "min-w-[60px] h-[40px] rounded-md cursor-pointer transition-all border-2",
                                    card.id === selectedCardId ? "border-black scale-110" : "border-transparent opacity-50"
                                )}
                                style={{ background: card.color }}
                            />
                        ))}
                        <div className="min-w-[60px] h-[40px] rounded-md border-2 border-dashed border-zinc-300 flex items-center justify-center cursor-pointer text-zinc-400 hover:border-zinc-400 hover:text-zinc-600">
                            <Plus className="w-4 h-4" />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Limite Utilizado</span>
                            <span className="text-sm text-zinc-500">R$ {selectedCard.used.toLocaleString()} / R$ {selectedCard.limit.toLocaleString()}</span>
                        </div>
                        <Progress value={(selectedCard.used / selectedCard.limit) * 100} className="h-3" />
                        <p className="text-xs text-right mt-1 text-muted-foreground">{Math.round((selectedCard.limit - selectedCard.used)).toLocaleString()} disponíveis</p>
                    </div>
                </div>

                {/* Fatura e Detalhes */}
                <div className="md:col-span-7 space-y-6">
                    <div className="orvion-card p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-primary/20 rounded-xl text-primary-dark">
                                <CalendarClock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Fatura Atual - {selectedCard.name}</h3>
                                <p className="text-zinc-500">Vence em 15 Dez</p>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-8">
                            <h2 className="text-5xl font-bold">R$ {selectedCard.used.toLocaleString()},90</h2>
                            <span className="text-zinc-400">aberta</span>
                        </div>

                        <div className="flex gap-4">
                            <Button className="flex-1 h-12 rounded-xl text-lg font-bold">Pagar Fatura</Button>
                            <Button variant="outline" className="flex-1 h-12 rounded-xl text-lg">Parcelar</Button>
                        </div>
                    </div>

                    <div className="orvion-card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Últimas Compras</h3>
                            <Button variant="ghost" className="text-xs">Ver tudo</Button>
                        </div>
                        <div className="space-y-2">
                            {[
                                { name: "Netflix", date: "Ontem", value: "55,90" },
                                { name: "Uber", date: "12 Dez", value: "24,90" },
                                { name: "Restaurante japonês", date: "10 Dez", value: "189,00" },
                                { name: "Amazon", date: "08 Dez", value: "320,50" },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 px-2 rounded-lg transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                            <CreditCard className="w-4 h-4 text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-zinc-400">{item.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">R$ {item.value}</span>
                                        <ChevronRight className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
