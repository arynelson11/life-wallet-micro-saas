"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MonthlyBillDialog } from "@/components/MonthlyBillDialog";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

type MonthlyBill = {
    id: string;
    title: string;
    amount: number;
    due_date: string;
    status: 'pending' | 'paid';
    description?: string;
    fixed_bills?: { category: string };
};

export default function CalendarClient({ initialTransactions }: { initialTransactions: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);

    // State for the specific bill detail modal
    const [selectedBill, setSelectedBill] = useState<MonthlyBill | null>(null);
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);

    const bills = initialTransactions as MonthlyBill[];

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Grid generation
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const startingDayIndex = getDay(startOfMonth(currentDate));

    const getBillsForDay = (date: Date) => {
        // Adjust for timezone issues if necessary, but assuming ISO strings YYYY-MM-DD
        // We compare the string part YYYY-MM-DD
        const dateString = format(date, 'yyyy-MM-dd');
        return bills.filter((b) => b.due_date === dateString);
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsDayModalOpen(true);
    };

    const handleBillClick = (bill: MonthlyBill) => {
        setSelectedBill(bill);
        setIsBillModalOpen(true);
    };

    const selectedDayBills = selectedDate ? getBillsForDay(selectedDate) : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold capitalize text-zinc-900">
                    {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 gap-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((weekDay) => (
                    <div key={weekDay} className="text-center font-bold text-zinc-400 text-sm uppercase tracking-wider">{weekDay}</div>
                ))}

                {/* Espaços vazios */}
                {Array.from({ length: startingDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {daysInMonth.map((day) => {
                    const dayBills = getBillsForDay(day);
                    const hasBills = dayBills.length > 0;
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => handleDayClick(day)}
                            className={`
                                min-h-[120px] border rounded-2xl p-3 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1
                                ${isToday ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" : "bg-white border-zinc-100"}
                            `}
                        >
                            <div className={`font-bold text-right mb-2 ${isToday ? 'text-blue-600' : 'text-zinc-700'}`}>
                                {format(day, "d")}
                            </div>

                            <div className="space-y-1.5">
                                {dayBills.slice(0, 3).map((bill) => (
                                    <div
                                        key={bill.id}
                                        className={`text-xs px-2 py-1 rounded-md truncate flex items-center gap-1.5
                                            ${bill.status === 'paid'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                            }`}
                                    >
                                        {bill.status === 'paid' ? <CheckCircle2 className="h-3 w-3 flex-shrink-0" /> : <Circle className="h-3 w-3 flex-shrink-0" />}
                                        <span className="truncate font-medium">{bill.title}</span>
                                    </div>
                                ))}
                                {dayBills.length > 3 && (
                                    <div className="text-xs text-zinc-400 pl-1">+{dayBills.length - 3} mais</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de Detalhes do Dia */}
            <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 mt-4">
                        {selectedDayBills.length > 0 ? (
                            selectedDayBills.map((bill) => (
                                <div
                                    key={bill.id}
                                    onClick={() => handleBillClick(bill)}
                                    className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${bill.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                            {bill.status === 'paid' ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-zinc-900">{bill.title}</p>
                                            <p className="text-xs text-zinc-500">{bill.fixed_bills?.category || 'Geral'}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-zinc-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bill.amount)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-zinc-400">
                                <p>Nenhuma conta para este dia.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de Edição da Conta Mensal */}
            <MonthlyBillDialog
                bill={selectedBill}
                open={isBillModalOpen}
                onOpenChange={setIsBillModalOpen}
            />
        </div>
    );
}