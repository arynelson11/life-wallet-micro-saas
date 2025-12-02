'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { syncGoogleCalendar } from "@/app/actions/calendar";
import { createManualReminder } from "@/app/actions/reminders";
import { toast } from "sonner"; // Assuming sonner is used, or I'll use simple alert/console if not sure. I'll use alert for now to be safe or check if toast is available. I'll stick to basic alert or just console.log if no toast.
// Actually, I'll use standard alert for simplicity or just rely on the return message.

export function CalendarActions() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await syncGoogleCalendar();
            if (result.success) {
                alert(result.message); // Simple feedback
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao sincronizar.");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleCreateReminder = async (formData: FormData) => {
        setIsCreating(true);
        try {
            const result = await createManualReminder(formData);
            if (result.success) {
                alert(result.message);
                setIsReminderOpen(false);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao criar lembrete.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Botão Principal: Sincronizar Google Calendar */}
            <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="h-12 flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg shadow-blue-200 transition-all"
            >
                {isSyncing ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sincronizando...
                    </>
                ) : (
                    <>
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        Sincronizar Google Calendar
                    </>
                )}
            </Button>

            {/* Botão Secundário: Criar Lembrete Manual */}
            <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="h-12 px-6 border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium">
                        <Plus className="mr-2 h-5 w-5" />
                        Criar Lembrete
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Lembrete Manual</DialogTitle>
                    </DialogHeader>
                    <form action={handleCreateReminder} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Nome do Lembrete</Label>
                            <Input id="description" name="description" placeholder="Ex: Pagar Internet" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input id="date" name="date" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Valor (Opcional)</Label>
                            <Input id="amount" name="amount" type="number" step="0.01" placeholder="0,00" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isCreating} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                {isCreating ? "Salvando..." : "Salvar Lembrete"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
