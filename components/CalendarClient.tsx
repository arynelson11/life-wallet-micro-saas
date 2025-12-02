"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Assumindo que você usa shadcn/ui ou similar

// Defina a tipagem conforme seu banco
type Transaction = {
    id: string;
    description: string; // ou 'name'
    amount: number;      // ou 'value'
    date: string;        // data da transação
    type: 'income' | 'expense'; // ajuste conforme seu banco
};

export default function CalendarClient({ initialTransactions }: { initialTransactions: Transaction[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Gera os dias do mês atual
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    // Ajuste para começar o grid no dia correto da semana
    const startingDayIndex = getDay(startOfMonth(currentDate));

    // Função para pegar transações de um dia específico
    const getTransactionsForDay = (date: Date) => {
        return initialTransactions.filter((t) =>
            isSameDay(new Date(t.date), date)
        );
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const selectedTransactions = selectedDate ? getTransactionsForDay(selectedDate) : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold capitalize">
                    {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                </h2>
                {/* Adicione botões de Próximo/Anterior mês aqui se quiser */}
            </div>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 gap-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((weekDay) => (
                    <div key={weekDay} className="text-center font-bold text-gray-500">{weekDay}</div>
                ))}

                {/* Espaços vazios antes do dia 1 */}
                {Array.from({ length: startingDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {daysInMonth.map((day) => {
                    const dayTransactions = getTransactionsForDay(day);
                    const hasTransactions = dayTransactions.length > 0;

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => handleDayClick(day)}
                            className={`
                min-h-[100px] border rounded-lg p-2 cursor-pointer transition-all hover:shadow-md
                ${isSameDay(day, new Date()) ? "bg-blue-50 border-blue-500" : "bg-white"}
              `}
                        >
                            <div className="font-semibold text-right">{format(day, "d")}</div>

                            {/* Bolinhas indicadoras ou resumo */}
                            <div className="mt-2 space-y-1">
                                {dayTransactions.slice(0, 3).map((t) => (
                                    <div key={t.id} className={`text-xs truncate ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.description}
                                    </div>
                                ))}
                                {dayTransactions.length > 3 && (
                                    <div className="text-xs text-gray-400">+{dayTransactions.length - 3} mais</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de Detalhes */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {selectedTransactions.length > 0 ? (
                            selectedTransactions.map((t) => (
                                <div key={t.id} className="flex justify-between items-center border-b pb-2">
                                    <span>{t.description}</span>
                                    <span className={`font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Nenhuma transação neste dia.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}