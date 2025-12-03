'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, Repeat } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { createFixedBill } from "@/app/actions/appointments";
import { createTransaction } from "@/app/actions/transactions";
import { toast } from "sonner";

export function TransactionDialog({ spaceId }: { spaceId: string }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecurrent, setIsRecurrent] = useState(false);
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

        // --- CORREÇÃO DE DATA (OFF-BY-ONE) ---
        // Quando criamos new Date("2023-12-15"), o JS assume UTC 00:00.
        // Se o usuário está no Brasil (UTC-3), isso vira "2023-12-14 21:00".
        // Para corrigir, vamos adicionar o horário 12:00 para garantir o mesmo dia.
        const dateStr = date as string;
        const safeDate = new Date(`${dateStr}T12:00:00`).toISOString();

        // Atualiza o formData com a data segura
        formData.set("date", safeDate);

        try {
            if (isRecurrent) {
                // Se for recorrente, cria como Appointment (Conta Fixa)
                // Precisamos adaptar os campos, pois createFixedBill espera 'title' e 'due_day'
                // Mas aqui temos 'description' e 'date'

                // Extrair dia do vencimento da data
                const dueDay = new Date(`${dateStr}T12:00:00`).getDate();

                formData.set("title", description as string);
                formData.set("due_day", dueDay.toString());

                const res = await createFixedBill(formData);
                if (res?.error) toast.error(res.error);
                else toast.success("Conta fixa criada com sucesso!");

            } else {
                // Transação normal
                // createTransaction já espera 'date' e 'description'
                // Mas precisamos garantir que createTransaction use a data que passamos ou a trate
                // Como createTransaction usa new Date(date), se passarmos ISO com T12:00:00, ele vai respeitar.

                // Vamos chamar a Server Action diretamente para garantir
                // Nota: createTransaction espera formData. Vamos garantir que o 'date' lá seja o safeDate
                // Como FormData é imutável em alguns contextos, vamos criar um novo se precisar, 
                // mas o set acima deve funcionar.

                const res = await createTransaction(formData);
                if (res?.error) toast.error(res.error);
                else toast.success("Transação criada com sucesso!");
            }

            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Erro ao salvar.");
        } finally {
            setIsLoading(false);
        }
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

                    {/* Toggle Recorrente */}
                    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <Repeat className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-base">É conta fixa?</Label>
                                <p className="text-xs text-zinc-500">Repetir todo mês (cria agendamento)</p>
                            </div>
                        </div>
                        <Switch checked={isRecurrent} onCheckedChange={setIsRecurrent} />
                    </div>

                    <Button disabled={isLoading} type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-12 rounded-xl">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Salvar"}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
}