"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createPersonalSpace } from "@/actions/space";
import { useState } from "react";
import { Loader2, Wallet, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function OnboardingView() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreateSpace = async () => {
        setIsLoading(true);
        try {
            const result = await createPersonalSpace();
            if (result.success) {
                toast.success("Carteira criada com sucesso! Atualizando...");
                // Force a hard reload to ensure server-side data is re-fetched effectively
                window.location.reload();
            } else {
                toast.error(result.error || "Erro ao criar carteira.");
            }
        } catch (error: any) {
            console.error("Onboarding Error:", error);
            toast.error(`Erro: ${error.message || JSON.stringify(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <Card className="w-full max-w-md border-0 bg-zinc-900/50 backdrop-blur-sm shadow-2xl">
                <CardHeader className="text-center space-y-4 pt-8">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-2 ring-1 ring-primary/20">
                        <Wallet className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">LifeWallet</CardTitle>
                    <CardDescription className="text-lg text-zinc-400">
                        Sua independência financeira começa aqui.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                    <div className="bg-black/40 p-5 rounded-2xl text-sm leading-relaxed text-zinc-400 text-center border border-white/5">
                        Vamos criar seu <span className="text-white font-medium">Espaço Pessoal</span> para organizar suas receitas, despesas e metas automáticas.
                    </div>
                    <Button
                        onClick={handleCreateSpace}
                        disabled={isLoading}
                        className="w-full h-14 text-lg gap-3 font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                        Começar Agora
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
