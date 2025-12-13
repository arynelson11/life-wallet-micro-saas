"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, FileText, Send } from "lucide-react";
import { toast } from "sonner";

export function ReportDialog() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.success(`Relatório enviado para ${email}!`);
        setIsLoading(false);
        setOpen(false);
        setEmail("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Relatório
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Gerar Relatório Financeiro</DialogTitle>
                    <DialogDescription>
                        Enviaremos um resumo completo do seu dashboard para o seu email.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSendReport} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email de destino</Label>
                        <Input
                            id="email"
                            placeholder="seu@email.com"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Enviar Relatório
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
