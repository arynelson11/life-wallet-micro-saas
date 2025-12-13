"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

interface TransactionDialogProps {
    type?: "earning" | "expense" | "debt" | "investment";
    trigger?: React.ReactNode;
}

export function TransactionDialog({ type = "expense", trigger }: TransactionDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="rounded-full gap-2 font-semibold">
                        <Plus className="w-4 h-4" />
                        Adicionar Manualmente
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Transação</DialogTitle>
                    <DialogDescription>
                        Insira os detalhes da transação abaixo.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome / Descrição</Label>
                        <Input id="name" placeholder="Ex: Supermercado" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="value">Valor</Label>
                            <Input id="value" placeholder="R$ 0,00" type="number" step="0.01" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Data</Label>
                            <Input id="date" type="date" required />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="food">Alimentação</SelectItem>
                                <SelectItem value="transport">Transporte</SelectItem>
                                <SelectItem value="housing">Moradia</SelectItem>
                                <SelectItem value="leisure">Lazer</SelectItem>
                                <SelectItem value="other">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Transação
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
