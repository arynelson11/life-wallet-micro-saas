"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createTransaction, updateTransaction, deleteTransaction, createCardTransaction } from "@/actions/finance-actions";
import { format } from "date-fns";

interface TransactionFormProps {
    type: "income" | "expense";
    initialData?: {
        id: string;
        description: string;
        amount: number;
        date: string;
        category: string;
    };
    spaceId: string; // Required to link to user space
    profileId: string; // Required for RLS
    creditCardId?: string; // Optional link to credit card
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function TransactionForm({ type, initialData, spaceId, profileId, creditCardId, trigger, onSuccess }: TransactionFormProps) {
    const isEdit = !!initialData;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        description: initialData?.description || "",
        amount: initialData?.amount || "",
        date: initialData?.date ? format(new Date(initialData.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        category: initialData?.category || ""
    });

    const [isInstallment, setIsInstallment] = useState(false);
    const [installments, setInstallments] = useState(2);

    const categories = type === 'income'
        ? ["Salário", "Freelance", "Renda Extra", "Investimentos", "Outros"]
        : ["Alimentação", "Transporte", "Moradia", "Lazer", "Assinaturas", "Saúde", "Educação", "Outros"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                space_id: spaceId,
                profile_id: profileId,
                description: formData.description,
                amount: Number(formData.amount),
                date: new Date(formData.date).toISOString(), // Ensure UTC for consistency
                category: formData.category,
                type: type,
                credit_card_id: creditCardId || null
            };

            if (!spaceId) {
                toast.error("Erro: Espaço não identificado. Recarregue a página.");
                setIsLoading(false);
                return;
            }

            let result;

            if (isEdit && initialData) {
                // Note: Updating card transactions is not fully wired yet (would need separate updateCardTransaction call if this was originally a card tx)
                // For now, assuming standard transaction update
                result = await updateTransaction(initialData.id, payload);
            } else if (creditCardId) {
                const cardPayload = {
                    space_id: spaceId,
                    card_id: creditCardId,
                    description: formData.description,
                    amount: Number(formData.amount),
                    date: new Date(formData.date).toISOString(),
                    category: formData.category,
                    installments_total: isInstallment ? installments : 1,
                    installments_current: 1,
                    status: 'pending'
                };
                result = await createCardTransaction(cardPayload);
            } else {
                result = await createTransaction(payload);
            }

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success(isEdit ? "Transação atualizada!" : (creditCardId ? "Compra no cartão registrada!" : "Transação criada!"));

            setOpen(false);
            if (!isEdit) { // Reset form only on create
                setFormData({ description: "", amount: "", date: format(new Date(), "yyyy-MM-dd"), category: "" });
            }
            onSuccess?.();
            // Refresh page data? Ideally via router.refresh() or parent callback
            window.location.reload();

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erro ao salvar transação");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

        setIsLoading(true);
        try {
            const result = await deleteTransaction(initialData.id);
            if (!result.success) throw new Error(result.error);

            toast.success("Transação excluída!");
            setOpen(false);
            onSuccess?.();
            window.location.reload();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao excluir");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="rounded-full gap-2 font-semibold shadow-md hover:shadow-lg transition-all">
                        {isEdit ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isEdit ? "Editar" : `Adicionar ${type === 'income' ? 'Receita' : 'Despesa'}`}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar Transação" : `Nova ${type === 'income' ? 'Receita' : 'Despesa'}`}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Altere os detalhes abaixo." : "Insira os dados da nova movimentação."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            placeholder="Ex: Supermercado"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Valor (R$)</Label>
                            <Input
                                id="amount"
                                placeholder="0,00"
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Data da Compra</Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Exibir opções de parcelamento APENAS se for Cartão de Crédito */}
                    {creditCardId && (
                        <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 dark:bg-zinc-900 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    id="isInstallment"
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={isInstallment}
                                    onChange={(e) => setIsInstallment(e.target.checked)}
                                />
                                <Label htmlFor="isInstallment" className="cursor-pointer">É uma compra parcelada?</Label>
                            </div>

                            {isInstallment && (
                                <div className="mt-2 animate-in slide-in-from-top-2 fade-in">
                                    <Label htmlFor="installments">Número de Parcelas</Label>
                                    <Input
                                        id="installments"
                                        type="number"
                                        min="2"
                                        max="48"
                                        value={installments}
                                        onChange={(e) => setInstallments(Number(e.target.value))}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Valor da parcela: R$ {(Number(formData.amount) / installments).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(val) => setFormData({ ...formData, category: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            {isEdit ? "Salvar Alterações" : "Confirmar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
