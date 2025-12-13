import { CreditCard, CalendarClock, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CreditCardForm } from "@/components/dashboard/forms/CreditCardForm";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CreditCardViewProps {
    cards: any[];
    spaceId: string;
}

export function CreditCardView({ cards = [], spaceId }: CreditCardViewProps) {
    const [selectedCardId, setSelectedCardId] = useState<string | number>(cards[0]?.id || 0);
    const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

    // Card Colors mapping if missing
    // or assume real data has color.

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Meus Cartões</h2>
                <CreditCardForm spaceId={spaceId} />
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 border-2 border-dashed rounded-xl">
                    Nenhum cartão cadastrado. Adicione um para começar.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Visual Cartão - Carousel */}
                    <div className="md:col-span-5 space-y-6">
                        {/* Main Displayed Card */}
                        {selectedCard && (
                            <div
                                className={cn(
                                    "w-full aspect-[1.586] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-500",
                                )}
                                style={{ background: `linear-gradient(135deg, ${selectedCard.color} 0%, #000 100%)` }}
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="absolute top-4 right-4 z-20">
                                    <CreditCardForm
                                        initialData={selectedCard}
                                        spaceId={spaceId}
                                        trigger={
                                            <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        }
                                    />
                                </div>

                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="w-12 h-10 bg-yellow-200/20 backdrop-blur-sm rounded-md border border-white/20 flex items-center justify-center">
                                        <div className="w-8 h-6 border border-white/30 rounded-sm" />
                                    </div>
                                    <span className="font-mono text-xl tracking-widest font-bold italic opacity-80">{selectedCard.name}</span>
                                </div>

                                <div className="relative z-10">
                                    <p className="font-mono text-xl md:text-2xl tracking-widest mb-6 drop-shadow-md">
                                        **** **** **** {selectedCard.due_day?.toString().padStart(2, '0') || "XX"}
                                    </p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] uppercase opacity-75 mb-1">Limite</p>
                                            <p className="font-medium tracking-wide text-sm md:text-base">R$ {selectedCard.limit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase opacity-75 mb-1">Vencimento</p>
                                            <p className="font-medium tracking-wide text-sm md:text-base">Dia {selectedCard.due_day}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
                        </div>
                    </div>

                    {/* Fatura e Detalhes */}
                    {selectedCard && (
                        <div className="md:col-span-7 space-y-6">
                            <div className="orvion-card p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-primary/20 rounded-xl text-primary-dark">
                                        <CalendarClock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Detalhes - {selectedCard.name}</h3>
                                        <p className="text-zinc-500">Fecha dia {selectedCard.closing_day}</p>
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-2 mb-8">
                                    {/* Mocking 'used' or 'invoice open' as we don't have transaction links yet */}
                                    <h2 className="text-5xl font-bold">R$ 0,00</h2>
                                    <span className="text-zinc-400">aberta</span>
                                </div>

                                <div className="flex gap-4">
                                    <Button className="flex-1 h-12 rounded-xl text-lg font-bold">Pagar Fatura</Button>
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl text-lg">Parcelar</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
