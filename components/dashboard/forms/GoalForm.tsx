"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Plus, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createGoal, updateGoal, deleteGoal } from "@/actions/finance-actions";

interface GoalFormProps {
    initialData?: {
        id: string;
        title: string;
        target_amount: number;
        current_amount: number;
        status: "active" | "completed";
    };
    spaceId: string;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function GoalForm({ initialData, spaceId, trigger, onSuccess }: GoalFormProps) {
    const isEdit = !!initialData;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        target_amount: initialData?.target_amount || "",
        current_amount: initialData?.current_amount || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                space_id: spaceId,
                title: formData.title,
                target_amount: Number(formData.target_amount),
                current_amount: Number(formData.current_amount),
                status: 'active'
            };

            if (!spaceId) {
                toast.error("Erro: Espaço não identificado.");
                setIsLoading(false);
                return;
            }

            let result;
            if (isEdit && initialData) {
                result = await updateGoal(initialData.id, payload);
            } else {
                result = await createGoal(payload);
            }

            if (!result.success) throw new Error(result.error);

            toast.success(isEdit ? "Meta atualizada!" : "Meta criada!");
            setOpen(false);
            if (!isEdit) setFormData({ title: "", target_amount: "", current_amount: "" });
            onSuccess?.();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erro ao salvar meta");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (!confirm("Excluir esta meta?")) return;
        setIsLoading(true);
        try {
            const result = await deleteGoal(initialData.id);
            if (!result.success) throw new Error(result.error);

            toast.success("Meta excluída!");
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
                    <Button className="rounded-full gap-2 font-semibold bg-primary text-black hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                        Nova Meta
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar Meta" : "Nova Meta / Investimento"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Nome da Meta</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Reserva de Emergência"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current">Valor Atual</Label>
                            <Input
                                id="current"
                                type="number"
                                step="0.01"
                                required
                                value={formData.current_amount}
                                onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="target">Meta (Alvo)</Label>
                            <Input
                                id="target"
                                type="number"
                                step="0.01"
                                required
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                            />
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
                            {isEdit ? "Salvar" : "Criar Meta"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
