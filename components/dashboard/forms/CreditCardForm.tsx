"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCreditCard, updateCreditCard, deleteCreditCard } from "@/actions/finance-actions";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const isEdit = !!initialData;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Parse name and digits if editing
    const nameMatch = initialData?.name.match(/(.*) (\d{4})$/);
    const initialName = nameMatch ? nameMatch[1] : (initialData?.name || "");
    const initialLast4 = nameMatch ? nameMatch[2] : "";

    const [formData, setFormData] = useState({
        name: initialName,
        last4: initialLast4,
        limit_amount: initialData?.limit_amount || "",
        closing_day: initialData?.closing_day || "",
        due_day: initialData?.due_day || "",
        color: initialData?.color || "#09090b" // Default black
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Combine name and digits
            const finalName = formData.last4 ? `${formData.name} ${formData.last4}` : formData.name;

            const payload = {
                space_id: spaceId,
                name: finalName,
                limit_amount: Number(formData.limit_amount),
                closing_day: Number(formData.closing_day),
                due_day: Number(formData.due_day),
                color: formData.color
            };

            // ... checks ...

            let result;
            if (isEdit && initialData) {
                result = await updateCreditCard(initialData.id, payload);
            } else {
                result = await createCreditCard(payload);
            }

            if (!result.success) throw new Error(result.error);

            toast.success(isEdit ? "Cartão atualizado!" : "Cartão criado com sucesso!");
            setOpen(false);
            if (!isEdit) setFormData({ name: "", last4: "", limit_amount: "", closing_day: "", due_day: "", color: "#09090b" });
            onSuccess?.();
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erro ao salvar cartão");
        } finally {
            setIsLoading(false);
        }
    };

    // ... handleDelete (update reload to router.refresh) ...
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
            router.refresh();
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
                    <Button className="rounded-full gap-2 font-semibold shadow-md active:scale-95 transition-all">
                        <Plus className="w-4 h-4" />
                        Adicionar Cartão
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="w-screen h-screen sm:w-full sm:h-auto sm:max-w-[425px] max-h-none sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-lg border-zinc-800 bg-[#09090b]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar Cartão" : "Novo Cartão"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8 grid gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Nubank"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="col-span-4 grid gap-2">
                            <Label htmlFor="last4">Final</Label>
                            <Input
                                id="last4"
                                placeholder="1234"
                                maxLength={4}
                                value={formData.last4}
                                onChange={(e) => setFormData({ ...formData, last4: e.target.value.replace(/\D/g, '') })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="limit">Limite (R$)</Label>
                        <Input
                            id="limit"
                            type="number"
                            placeholder="0,00"
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
                                placeholder="Dia"
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
                                placeholder="Dia"
                                required
                                value={formData.due_day}
                                onChange={(e) => setFormData({ ...formData, due_day: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Cor do Cartão</Label>
                        <div className="flex gap-4">
                            {[
                                '#820ad1', // Nubank (Purple)
                                '#09090b', // Black
                                '#f97316', // Inter (Orange)
                                '#3b82f6', // Blue
                                '#22c55e'  // Green
                            ].map(color => (
                                <div
                                    key={color}
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 shadow-sm flex items-center justify-center ${formData.color === color ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' : 'opacity-80 hover:opacity-100'}`}
                                    style={{ background: color }}
                                >
                                    {formData.color === color && <div className="w-full h-full rounded-full border-2 border-white/20" />}
                                </div>
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
                        <Button type="submit" disabled={isLoading} className="ml-auto w-full md:w-auto font-bold">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Salvar" : "Criar Cartão"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
