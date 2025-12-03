"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { deleteAppointment } from "@/app/actions/appointments";
import { toast } from "sonner";

type Appointment = {
    id: string;
    title: string;
    amount: number;
    date: string; // ISO string from DB
    status: 'pending' | 'paid';
    type: 'bill' | 'task';
    category?: string;
};

export default function CalendarClient({ initialTransactions }: { initialTransactions: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const appointments = initialTransactions as Appointment[];

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Grid generation
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const startingDayIndex = getDay(startOfMonth(currentDate));

    const getAppointmentsForDay = (date: Date) => {
        // Compare YYYY-MM-DD
        const dateString = format(date, 'yyyy-MM-dd');
        return appointments.filter((a) => {
            const aDate = new Date(a.date);
            return format(aDate, 'yyyy-MM-dd') === dateString;
        });
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsDayModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta conta?")) return;
        setLoading(true);
        try {
            const res = await deleteAppointment(id);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Conta excluída!");
                setIsDayModalOpen(false); // Close to refresh or just let revalidate handle it
            }
        } catch (error) {
            toast.error("Erro ao excluir");
        } finally {
            setLoading(false);
        }
    };

    const selectedDayAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : [];

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
                    const dayApps = getAppointmentsForDay(day);
                    const hasApps = dayApps.length > 0;
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
                                {dayApps.slice(0, 3).map((app) => (
                                    <div
                                        key={app.id}
                                        className={`text-[10px] px-1.5 py-0.5 rounded-md truncate flex items-center gap-1
                                            ${app.status === 'paid'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                            }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="truncate font-medium">{app.title}</span>
                                    </div>
                                ))}
                                {dayApps.length > 3 && (
                                    <div className="text-[10px] text-zinc-400 pl-1">+{dayApps.length - 3}</div>
                                )}
                            </div>

                            {/* Mobile Dots */}
                            <div className="flex md:hidden gap-1 justify-end flex-wrap">
                                {dayApps.map((app, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${app.status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`} />
                                ))}
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
                        {selectedDayAppointments.length > 0 ? (
                            selectedDayAppointments.map((app) => (
                                <div
                                    key={app.id}
                                    className="flex justify-between items-center p-3 rounded-xl border border-zinc-100 bg-white shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${app.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                            {app.status === 'paid' ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-zinc-900">{app.title}</p>
                                            <p className="text-xs text-zinc-500">{app.category || 'Geral'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-zinc-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(app.amount)}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8"
                                            onClick={() => handleDelete(app.id)}
                                            disabled={loading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
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
        </div>
    );
}