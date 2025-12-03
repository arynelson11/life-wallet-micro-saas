"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, addMonths, subMonths, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Trash2, Edit2, Calendar as CalendarIcon, Save } from "lucide-react";
import { deleteAppointment, updateAppointment } from "@/app/actions/appointments";
import { deleteTransaction, updateTransaction } from "@/app/actions/transactions";
import { toast } from "sonner";

type Event = {
    id: string;
    title: string;
    amount: number;
    date: string; // ISO string
    status: 'pending' | 'paid';
    type: 'bill' | 'task' | 'income' | 'expense';
    category?: string;
    source: 'appointment' | 'transaction';
    isPaid: boolean;
};

export default function CalendarClient({ initialTransactions }: { initialTransactions: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Editing State
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ amount: string, date: string }>({ amount: "", date: "" });

    const events = initialTransactions as Event[];

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Grid generation
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const startingDayIndex = getDay(startOfMonth(currentDate));

    // --- CORREÇÃO DE DATA (OFF-BY-ONE) ---
    // A data vem do banco como ISO (ex: 2023-12-15T00:00:00Z).
    // Se usarmos new Date(iso), o navegador converte para local. Se for Brasil (UTC-3), vira dia 14 às 21h.
    // SOLUÇÃO: Vamos extrair apenas a parte YYYY-MM-DD da string ISO e comparar strings.
    const getEventsForDay = (date: Date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        return events.filter((e) => {
            // Pega os primeiros 10 chars (YYYY-MM-DD) da string ISO do banco
            const eventDateString = e.date.substring(0, 10);
            return eventDateString === dateString;
        });
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsDayModalOpen(true);
        setEditingEventId(null); // Reset edit mode
    };

    const handleDelete = async (id: string, source: 'appointment' | 'transaction') => {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        setLoading(true);
        try {
            if (source === 'appointment') {
                await deleteAppointment(id);
            } else {
                await deleteTransaction(id);
            }
            toast.success("Item excluído!");
            setIsDayModalOpen(false);
        } catch (error) {
            toast.error("Erro ao excluir");
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (event: Event) => {
        setEditingEventId(event.id);
        setEditForm({
            amount: Math.abs(event.amount).toString(),
            date: event.date.substring(0, 10)
        });
    };

    const saveEdit = async (event: Event) => {
        setLoading(true);
        try {
            // Correção de data ao salvar
            const safeDate = new Date(`${editForm.date}T12:00:00`).toISOString();
            const newAmount = parseFloat(editForm.amount);

            if (event.source === 'appointment') {
                await updateAppointment(event.id, {
                    date: safeDate,
                    amount: newAmount
                });
            } else {
                await updateTransaction(event.id, {
                    date: safeDate,
                    amount: event.type === 'expense' ? -Math.abs(newAmount) : Math.abs(newAmount)
                });
            }
            toast.success("Atualizado com sucesso!");
            setEditingEventId(null);
            setIsDayModalOpen(false); // Close to refresh
        } catch (error) {
            toast.error("Erro ao atualizar");
        } finally {
            setLoading(false);
        }
    };

    const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-2xl font-bold capitalize text-zinc-900">
                    {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-full hover:bg-blue-50 hover:text-blue-600 border-zinc-200">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full hover:bg-blue-50 hover:text-blue-600 border-zinc-200">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 gap-2 md:gap-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((weekDay) => (
                    <div key={weekDay} className="text-center font-bold text-zinc-400 text-xs md:text-sm uppercase tracking-wider">{weekDay}</div>
                ))}

                {/* Espaços vazios */}
                {Array.from({ length: startingDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {daysInMonth.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => handleDayClick(day)}
                            className={`
                                min-h-[80px] md:min-h-[120px] border rounded-2xl p-2 md:p-3 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 relative
                                ${isToday ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" : "bg-white border-zinc-100"}
                                ${isSelected ? "ring-2 ring-blue-300" : ""}
                            `}
                        >
                            <div className={`font-bold text-right mb-1 md:mb-2 text-sm md:text-base ${isToday ? 'text-blue-600' : 'text-zinc-700'}`}>
                                {format(day, "d")}
                            </div>

                            {/* Dots for Mobile / List for Desktop */}
                            <div className="space-y-1 hidden md:block">
                                {dayEvents.slice(0, 3).map((ev) => (
                                    <div
                                        key={ev.id}
                                        className={`text-[10px] px-1.5 py-0.5 rounded-md truncate flex items-center gap-1
                                            ${ev.source === 'appointment'
                                                ? (ev.isPaid ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')
                                                : 'bg-zinc-100 text-zinc-600'
                                            }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full 
                                            ${ev.source === 'appointment'
                                                ? (ev.isPaid ? 'bg-green-500' : 'bg-blue-500')
                                                : 'bg-zinc-400'
                                            }`}
                                        />
                                        <span className="truncate font-medium">{ev.title}</span>
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-[10px] text-zinc-400 pl-1">+{dayEvents.length - 3}</div>
                                )}
                            </div>

                            {/* Mobile Dots */}
                            <div className="flex md:hidden gap-1 justify-end flex-wrap">
                                {dayEvents.map((ev, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full 
                                        ${ev.source === 'appointment'
                                            ? (ev.isPaid ? 'bg-green-500' : 'bg-blue-500')
                                            : 'bg-zinc-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de Detalhes do Dia */}
            <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map((ev) => (
                                <div
                                    key={ev.id}
                                    className={`p-3 rounded-xl border shadow-sm transition-all
                                        ${ev.source === 'appointment' ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-zinc-100'}
                                    `}
                                >
                                    {editingEventId === ev.id ? (
                                        // --- MODO EDIÇÃO ---
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label className="text-xs">Valor</Label>
                                                    <Input
                                                        type="number"
                                                        value={editForm.amount}
                                                        onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Data</Label>
                                                    <Input
                                                        type="date"
                                                        value={editForm.date}
                                                        onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => saveEdit(ev)} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                                    <Save className="h-4 w-4 mr-2" /> Salvar
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingEventId(null)}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        // --- MODO VISUALIZAÇÃO ---
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full 
                                                    ${ev.source === 'appointment'
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-zinc-100 text-zinc-500'
                                                    }`}>
                                                    {ev.source === 'appointment' ? <CalendarIcon className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-zinc-900">{ev.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase
                                                            ${ev.source === 'appointment' ? 'bg-blue-200 text-blue-800' : 'bg-zinc-200 text-zinc-700'}
                                                        `}>
                                                            {ev.source === 'appointment' ? 'Conta Fixa' : 'Realizado'}
                                                        </span>
                                                        <p className="text-xs text-zinc-500">{ev.category || 'Geral'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${ev.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(ev.amount))}
                                                </span>

                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-zinc-400 hover:text-blue-600"
                                                        onClick={() => startEditing(ev)}
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-zinc-400 hover:text-red-600"
                                                        onClick={() => handleDelete(ev.id, ev.source)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-zinc-400">
                                <p>Nenhuma movimentação neste dia.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}