"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createDebt, updateDebt, deleteDebt } from "@/actions/finance-actions";

interface DebtFormProps {
    initialData?: {
        id: string;
        title: string;
        total_amount: number;
        paid_amount: number;
        due_date?: string;
    };
    spaceId: string;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function DebtForm({ initialData, spaceId, trigger, onSuccess }: DebtFormProps) {
    const isEdit = !!initialData;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        total_amount: initialData?.total_amount || "",
        paid_amount: initialData?.paid_amount || "0",
        due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                space_id: spaceId,
                title: formData.title,
                total_amount: Number(formData.total_amount),
                paid_amount: Number(formData.paid_amount),
                due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
            };

            if (isEdit && initialData) {
                await updateDebt(initialData.id, payload);
                toast.success("Dívida atualizada!");
            } else {
                await createDebt(payload);
                toast.success("Dívida adicionada!");
            }

            setOpen(false);
            if (!isEdit) setFormData({ title: "", total_amount: "", paid_amount: "0", due_date: "" });
            onSuccess?.();
            window.location.reload();

        } catch (error) {
            toast.error("Erro ao salvar dívida");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (!confirm("Excluir esta dívida?")) return;
        setIsLoading(true);
        try {
            await deleteDebt(initialData.id);
            toast.success("Dívida excluída");
            setOpen(false);
            onSuccess?.();
            window.location.reload();
        } catch {
            toast.error("Erro ao excluir");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="rounded-full gap-2 font-semibold bg-red-600 hover:bg-red-700 text-white">
                        <Plus className="w-4 h-4" />
                        Adicionar Dívida
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar Dívida" : "Nova Dívida"}</DialogTitle>
                    <DialogDescription>Cadastre suas pendências para organizar o pagamento.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Financiamento Carro"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="total">Valor Total</Label>
                            <Input
                                id="total"
                                type="number"
                                step="0.01"
                                required
                                value={formData.total_amount}
                                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="paid">Valor Já Pago</Label>
                            <Input
                                id="paid"
                                type="number"
                                step="0.01"
                                required
                                value={formData.paid_amount}
                                onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="due_date">Vencimento (Opcional)</Label>
                        <Input
                            id="due_date"
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        {isEdit && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button type="submit" disabled={isLoading} className="ml-auto bg-red-600 hover:bg-red-700 text-white">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Salvar" : "Criar Dívida"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
