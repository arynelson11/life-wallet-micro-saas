"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAsset } from "@/app/actions/investments";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AddAssetModalProps {
    spaceId: string;
    children?: React.ReactNode;
}

export function AddAssetModal({ spaceId, children }: AddAssetModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Form States for calculation
    const [quantity, setQuantity] = useState<string>("");
    const [unitPrice, setUnitPrice] = useState<string>("");
    const [totalValue, setTotalValue] = useState<string>("0.00");

    // Auto-calculate Total Value
    useEffect(() => {
        const qty = parseFloat(quantity);
        const price = parseFloat(unitPrice);
        if (!isNaN(qty) && !isNaN(price)) {
            setTotalValue((qty * price).toFixed(2));
        } else {
            setTotalValue("0.00");
        }
    }, [quantity, unitPrice]);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            formData.append("space_id", spaceId);
            // Ensure calculated total is sent if not manually overridden (though typically we trust the server or recalc there, here we just send what we have)
            // Actually, we should probably send the total amount to the 'amount' column for backward compatibility/simplicity
            formData.set("amount", totalValue);

            await createAsset(formData);
            toast.success("Ativo adicionado com sucesso!");
            router.refresh();
            setOpen(false);
            // Reset form
            setQuantity("");
            setUnitPrice("");
            setTotalValue("0.00");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao adicionar ativo.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="h-10 rounded-full bg-black text-white hover:bg-black/90 px-6 shadow-lg shadow-black/10">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Investimento
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl rounded-[2rem] border-white/10 bg-[#09090b] text-white p-0 overflow-hidden">
                <DialogHeader className="px-8 pt-8 pb-4 bg-zinc-900/50 border-b border-white/5">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Novo Investimento 📈
                    </DialogTitle>
                    <p className="text-zinc-400 text-sm">Adicione um novo ativo à sua carteira.</p>
                </DialogHeader>

                <form action={handleSubmit} className="p-8 space-y-6">

                    {/* Linha 1: Nome e Ticker */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Categoria</Label>
                            <Select name="category" required>
                                <SelectTrigger className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary focus:border-primary">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="Ações">Ações (Stocks)</SelectItem>
                                    <SelectItem value="FIIs">FIIs</SelectItem>
                                    <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                                    <SelectItem value="Cripto">Criptomoedas</SelectItem>
                                    <SelectItem value="Fundos">Fundos de Investimento</SelectItem>
                                    <SelectItem value="Outros">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Ticker / Símbolo</Label>
                            <Input
                                name="ticker"
                                placeholder="Ex: PETR4, BTC, CDB Banco X"
                                className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary uppercase placeholder:normal-case"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-400">Nome do Ativo (Descrição)</Label>
                        <Input
                            name="name"
                            placeholder="Ex: Petrobras PN, Bitcoin"
                            required
                            className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary"
                        />
                    </div>


                    {/* Linha 2: Quantidade e Preço Unitário */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Data da Compra</Label>
                            <div className="relative">
                                <Input
                                    name="purchase_date"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                    className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary pl-10"
                                />
                                <CalendarIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Quantidade</Label>
                            <Input
                                name="quantity"
                                type="number"
                                step="0.00000001"
                                placeholder="0"
                                required
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary text-right font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Preço Unitário (R$)</Label>
                            <Input
                                name="unit_price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                required
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                                className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary text-right font-mono"
                            />
                        </div>
                    </div>

                    {/* Total Calculado */}
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                            <Label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Total Investido</Label>
                            <p className="text-sm text-zinc-400 mt-1">Calculado automaticamente</p>
                        </div>
                        <div className="text-right">
                            <span className="text-zinc-500 mr-2 text-lg">R$</span>
                            <span className="text-3xl font-bold text-primary tracking-tight">{totalValue}</span>
                            <input type="hidden" name="amount" value={totalValue} />
                        </div>
                    </div>

                    <Button disabled={isLoading} type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-bold h-14 text-lg rounded-xl shadow-lg shadow-primary/20">
                        {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : "Confirmar Investimento"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
