import { CreditCard, CalendarClock, Pencil, Wifi, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CreditCardForm } from "@/components/dashboard/forms/CreditCardForm";
import { TransactionForm } from "@/components/dashboard/forms/TransactionForm";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CreditCardViewProps {
    cards: any[];
    spaceId: string;
    profileId: string;
}

export function CreditCardView({ cards = [], spaceId, profileId }: CreditCardViewProps) {
    const [selectedCardId, setSelectedCardId] = useState<string | number | null>(null);

    // Effect to set initial selected card when cards load
    useEffect(() => {
        if (cards.length > 0 && !selectedCardId) {
            setSelectedCardId(cards[0].id);
        }
    }, [cards, selectedCardId]);

    const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    // Helper to determine card brand logo based on name
    const CardBrand = () => {
        const isVisa = selectedCard?.name?.toLowerCase().includes('visa');

        if (isVisa) {
            return (
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black italic tracking-tighter text-white/90">VISA</span>
                </div>
            )
        }

        // Default to Mastercard style
        return (
            <div className="flex flex-col items-center">
                <div className="flex -space-x-4">
                    <div className="w-8 h-8 rounded-full bg-[#EB001B]/90 mix-blend-screen" />
                    <div className="w-8 h-8 rounded-full bg-[#F79E1B]/90 mix-blend-screen" />
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Meus Cartões</h2>
                <div className="flex gap-2">
                    <TransactionForm
                        type="expense"
                        spaceId={spaceId}
                        profileId={profileId}
                        creditCardId={selectedCard?.id}
                        trigger={
                            <Button className="rounded-full gap-2 font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-95">
                                <Plus className="w-4 h-4" />
                                Nova Compra
                            </Button>
                        }
                    />
                    <CreditCardForm spaceId={spaceId} />
                </div>
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum cartão cadastrado.</p>
                    <p className="text-sm">Adicione um para começar a gerenciar seus gastos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Visual Cartão - Carousel */}
                    <div className="md:col-span-5 space-y-6">
                        {/* Main Displayed Card */}
                        {selectedCard && (
                            <div
                                className={cn(
                                    "w-full aspect-[1.586] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500 transform hover:scale-[1.02]",
                                )}
                                style={{
                                    background: `linear-gradient(135deg, ${selectedCard.color} 0%, #1a1a1a 100%)`,
                                    boxShadow: `0 20px 40px -10px ${selectedCard.color}40`
                                }}
                            >
                                {/* Noise Texture overlay (optional, css only) */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="absolute top-6 right-6 z-20">
                                    <CreditCardForm
                                        initialData={selectedCard}
                                        spaceId={spaceId}
                                        trigger={
                                            <button className="bg-black/20 p-2 rounded-full hover:bg-black/40 text-white transition-colors backdrop-blur-md">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        }
                                    />
                                </div>

                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md border border-white/20 flex items-center justify-center shadow-sm relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10 flex gap-[2px] p-1">
                                            <div className="w-1/3 h-full border-r border-black/20"></div>
                                            <div className="w-1/3 h-full border-r border-black/20"></div>
                                        </div>
                                    </div>
                                    <Wifi className="w-6 h-6 rotate-90 text-white/50" />
                                </div>

                                <div className="relative z-10 mt-4">
                                    <span className="font-mono text-xl md:text-2xl tracking-[0.15em] font-medium text-white/90 drop-shadow-md">
                                        •••• •••• •••• {String(selectedCard.limit).slice(0, 2)}XX
                                    </span>
                                </div>

                                <div className="relative z-10 flex justify-between items-end">
                                    <div>
                                        <p className="font-medium tracking-wide text-sm md:text-base uppercase text-white/80 mb-1">{selectedCard.name}</p>
                                        <div className="flex gap-4 text-xs font-mono text-white/60">
                                            <span>VAL {String(selectedCard.due_day).padStart(2, '0')}/28</span>
                                        </div>
                                    </div>
                                    <CardBrand />
                                </div>
                            </div>
                        )}

                        {/* Card Selector Loop */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                            {cards.map(card => (
                                <div
                                    key={card.id}
                                    onClick={() => setSelectedCardId(card.id)}
                                    className={cn(
                                        "min-w-[60px] h-[40px] rounded-lg cursor-pointer transition-all border-2 relative overflow-hidden snap-center",
                                        card.id === selectedCardId ? "border-white ring-2 ring-offset-2 ring-offset-[#09090b] ring-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                    style={{ background: card.color }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fatura e Detalhes */}
                    {selectedCard && (
                        <div className="md:col-span-7 space-y-6">
                            <div className="orvion-card p-6 md:p-8 border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-zinc-800 rounded-2xl text-white shadow-inner">
                                        <CalendarClock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-white">Fatura Atual</h3>
                                        <p className="text-zinc-400 text-sm">Fecha dia <span className="text-white font-bold">{selectedCard.closing_day}</span></p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 mb-8">
                                    <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Valor em Aberto</p>
                                    <div className="flex items-baseline gap-3">
                                        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter">
                                            {formatCurrency(selectedCard.used || 0)}
                                        </h2>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000"
                                            style={{ width: `${Math.min(((selectedCard.used || 0) / (selectedCard.limit || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-zinc-500 mt-2 font-mono">
                                        <span>R$ 0,00</span>
                                        <span>Limite R$ {selectedCard.limit}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button className="h-14 rounded-xl text-base font-bold bg-white text-black hover:bg-zinc-200">
                                        Pagar Fatura
                                    </Button>
                                    <Button variant="outline" className="h-14 rounded-xl text-base border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                                        Parcelar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
