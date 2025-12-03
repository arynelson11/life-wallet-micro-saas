'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMonthlyBill } from "@/app/actions/monthly-bills";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface MonthlyBillDialogProps {
    bill: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MonthlyBillDialog({ bill, open, onOpenChange }: MonthlyBillDialogProps) {
    const [loading, setLoading] = useState(false);

    if (!bill) return null;

    async function handlePay() {
        setLoading(true);
        try {
            await updateMonthlyBill(bill.id, { status: 'paid' });
            toast.success("Conta marcada como paga!");
            onOpenChange(false);
        } catch (error) {
            toast.error("Erro ao atualizar conta");
        } finally {
            setLoading(false);
        }
    }

    async function handleUnpay() {
        setLoading(true);
        try {
            await updateMonthlyBill(bill.id, { status: 'pending' });
            toast.success("Conta marcada como pendente!");
            onOpenChange(false);
        } catch (error) {
            toast.error("Erro ao atualizar conta");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(formData: FormData) {
        setLoading(true);
        try {
            const amount = parseFloat(formData.get("amount") as string);
            const observation = formData.get("observation") as string;

            await updateMonthlyBill(bill.id, { amount, observation });
            toast.success("Conta atualizada!");
            onOpenChange(false);
        } catch (error) {
            toast.error("Erro ao atualizar conta");
        } finally {
            setLoading(false);
        }
    }

    const isPaid = bill.status === 'paid';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {bill.title}
                        {isPaid && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="flex justify-between items-center p-4 bg-zinc-50 rounded-xl">
                        <div>
                            <p className="text-sm text-zinc-500">Vencimento</p>
                            <p className="font-medium">{new Date(bill.due_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-zinc-500">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {isPaid ? 'PAGO' : 'PENDENTE'}
                            </span>
                        </div>
                    </div>

                    <form action={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Valor deste mês (R$)</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                defaultValue={bill.amount}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="observation">Observação</Label>
                            <Input
                                id="observation"
                                name="observation"
                                defaultValue={bill.description || ""}
                                placeholder="Ex: Veio mais caro esse mês..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" variant="outline" className="flex-1" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
                            </Button>

                            {isPaid ? (
                                <Button type="button" onClick={handleUnpay} variant="secondary" className="flex-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200" disabled={loading}>
                                    Reabrir Conta
                                </Button>
                            ) : (
                                <Button type="button" onClick={handlePay} className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                                    Marcar como Pago
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
