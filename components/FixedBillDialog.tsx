'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFixedBill } from "@/app/actions/fixed-bills";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function FixedBillDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            const result = await createFixedBill(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Conta fixa criada com sucesso!");
                setOpen(false);
            }
        } catch (error) {
            toast.error("Erro ao criar conta fixa");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus className="h-4 w-4" /> Nova Conta Fixa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Conta Fixa</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Nome da Conta</Label>
                        <Input id="title" name="title" placeholder="Ex: Aluguel, Internet" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Valor (R$)</Label>
                            <Input id="amount" name="amount" type="number" step="0.01" placeholder="0,00" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="due_day">Dia de Vencimento</Label>
                            <Input id="due_day" name="due_day" type="number" min="1" max="31" placeholder="Dia (1-31)" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select name="category" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Casa">Casa</SelectItem>
                                <SelectItem value="Contas">Contas (Luz/Água)</SelectItem>
                                <SelectItem value="Educação">Educação</SelectItem>
                                <SelectItem value="Saúde">Saúde</SelectItem>
                                <SelectItem value="Transporte">Transporte</SelectItem>
                                <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Observação (Opcional)</Label>
                        <Input id="description" name="description" placeholder="Detalhes extras..." />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Salvar Conta Fixa
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
