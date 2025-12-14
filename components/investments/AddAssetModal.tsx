"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// ...

export function AddAssetModal({ spaceId, children }: AddAssetModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            formData.append("space_id", spaceId);
            await createAsset(formData);
            toast.success("Ativo adicionado com sucesso!");
            router.refresh();
            setOpen(false);
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
            <DialogContent className="sm:max-w-md rounded-[2rem] border-white/10 bg-[#09090b] text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Novo Investimento 📈</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label>Nome do Ativo</Label>
                        <Input name="name" placeholder="Ex: PETR4, Tesouro Selic" required className="rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select name="category" required>
                                <SelectTrigger className="rounded-xl bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="Ações">Ações</SelectItem>
                                    <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                                    <SelectItem value="FIIs">FIIs</SelectItem>
                                    <SelectItem value="Cripto">Cripto</SelectItem>
                                    <SelectItem value="Fundos">Fundos</SelectItem>
                                    <SelectItem value="Outros">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Valor Investido (R$)</Label>
                            <Input name="amount" type="number" step="0.01" placeholder="0.00" required className="rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary" />
                        </div>
                    </div>

                    <Button disabled={isLoading} type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-bold h-12 rounded-xl">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Adicionar Ativo"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
