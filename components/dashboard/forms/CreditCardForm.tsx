"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCreditCard, updateCreditCard, deleteCreditCard } from "@/actions/finance-actions";

interface CreditCardFormProps {
    initialData?: {
        id: string;
        name: string;
        limit_amount: number;
        closing_day: number;
        due_day: number;
        color: string;
    };
    spaceId: string;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function CreditCardForm({ initialData, spaceId, trigger, onSuccess }: CreditCardFormProps) {
    const isEdit = !!initialData;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        limit_amount: initialData?.limit_amount || "",
        closing_day: initialData?.closing_day || "",
        due_day: initialData?.due_day || "",
        color: initialData?.color || "#000000"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                space_id: spaceId,
                name: formData.name,
                limit_amount: Number(formData.limit_amount),
                closing_day: Number(formData.closing_day),
                due_day: Number(formData.due_day),
                color: formData.color
            };

            if (!spaceId) {
                toast.error("Erro: Espaço não identificado.");
                setIsLoading(false);
                return;
            }

            let result;
            if (isEdit && initialData) {
                result = await updateCreditCard(initialData.id, payload);
            } else {
                result = await createCreditCard(payload);
            }

            if (!result.success) throw new Error(result.error);

            toast.success(isEdit ? "Cartão atualizado!" : "Cartão criado!");
            setOpen(false);
            if (!isEdit) setFormData({ name: "", limit_amount: "", closing_day: "", due_day: "", color: "#000000" });
            onSuccess?.();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erro ao salvar cartão");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (!confirm("Excluir este cartão?")) return;
        setIsLoading(true);
        try {
            const result = await deleteCreditCard(initialData.id);
            if (!result.success) throw new Error(result.error);

            toast.success("Cartão excluído!");
            setOpen(false);
            onSuccess?.();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erro ao excluir");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="rounded-full gap-2 font-semibold">
                        <Plus className="w-4 h-4" />
                        Adicionar Cartão
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar Cartão" : "Novo Cartão de Crédito"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Apelido do Cartão</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Nubank Platinum"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="limit">Limite (R$)</Label>
                        <Input
                            id="limit"
                            type="number"
                            required
                            value={formData.limit_amount}
                            onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="closing">Dia Fechamento</Label>
                            <Input
                                id="closing"
                                type="number"
                                min="1" max="31"
                                placeholder="DD"
                                required
                                value={formData.closing_day}
                                onChange={(e) => setFormData({ ...formData, closing_day: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="due">Dia Vencimento</Label>
                            <Input
                                id="due"
                                type="number"
                                min="1" max="31"
                                placeholder="DD"
                                required
                                value={formData.due_day}
                                onChange={(e) => setFormData({ ...formData, due_day: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Cor do Cartão</Label>
                        <div className="flex gap-2">
                            {['#820ad1', '#ff7a00', '#000000', '#0051ff', '#e60012'].map(color => (
                                <div
                                    key={color}
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${formData.color === color ? 'border-primary' : 'border-transparent'}`}
                                    style={{ background: color }}
                                />
                            ))}
                        </div>
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
                        <Button type="submit" disabled={isLoading} className="ml-auto">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Salvar" : "Adicionar Cartão"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
