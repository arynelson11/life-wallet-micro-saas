'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function TransactionDialog({ spaceId }: { spaceId: string }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const amount = formData.get("amount");
        const description = formData.get("description");
        const category = formData.get("category");
        const type = formData.get("type");
        const date = formData.get("date");

        // Validação básica
        if (!amount || !description || !category || !type || !date) {
            setIsLoading(false);
            return;
        }

        // Se não tiver spaceId (usuário novo), tenta criar um agora
        let finalSpaceId = spaceId;
        if (!finalSpaceId) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Tenta achar ou criar
                const { data: newSpace } = await supabase.from("spaces").insert({ name: "Minha Carteira", owner_id: user.id }).select().single();
                if (newSpace) {
                    finalSpaceId = newSpace.id;
                    // Cria membro
                    await supabase.from("space_members").insert({ space_id: newSpace.id, user_id: user.id, role: 'admin' });
                }
            }
        }

        const { error } = await supabase.from("transactions").insert({
            amount: Number(amount),
            description,
            category,
            type,
            date,
            space_id: finalSpaceId
        });

        if (!error) {
            setOpen(false);
            router.refresh();
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                    <Plus className="h-4 w-4" /> Nova Transação
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Adicionar Movimentação 💸</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                    {/* Tipo (Receita/Despesa) */}
                    <RadioGroup defaultValue="expense" name="type" className="grid grid-cols-2 gap-4">
                        <div>
                            <RadioGroupItem value="expense" id="expense" className="peer sr-only" />
                            <Label htmlFor="expense" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-zinc-50 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:text-red-600 cursor-pointer transition-all">
                                <span className="text-xl mb-1">💸</span>
                                <span className="font-bold">Saída</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="income" id="income" className="peer sr-only" />
                            <Label htmlFor="income" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-zinc-50 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:text-green-600 cursor-pointer transition-all">
                                <span className="text-xl mb-1">💰</span>
                                <span className="font-bold">Entrada</span>
                            </Label>
                        </div>
                    </RadioGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Valor (R$)</Label>
                            <Input name="amount" type="number" step="0.01" placeholder="0,00" required className="text-lg font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label>Data</Label>
                            <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Input name="description" placeholder="Ex: Mercado, Salário..." required />
                    </div>

                    <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select name="category" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Alimentação">🍔 Alimentação</SelectItem>
                                <SelectItem value="Transporte">🚗 Transporte</SelectItem>
                                <SelectItem value="Lazer">🎉 Lazer</SelectItem>
                                <SelectItem value="Casa">🏠 Casa</SelectItem>
                                <SelectItem value="Contas">📄 Contas</SelectItem>
                                <SelectItem value="Salário">💵 Salário</SelectItem>
                                <SelectItem value="Outros">📦 Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button disabled={isLoading} type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-12 rounded-xl">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Salvar"}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
}