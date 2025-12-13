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
        } catch (error) {
            toast.error("Erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md border-2 border-primary/10 shadow-xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <Wallet className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Bem-vindo ao LifeWallet!</CardTitle>
                    <CardDescription className="text-base">
                        Para começar a controlar suas finanças, precisamos criar sua primeira carteira digital.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground text-center">
                        Isso criará um espaço seguro ("Minha Carteira") onde você poderá registrar suas receitas, despesas e metas.
                    </div>
                    <Button
                        onClick={handleCreateSpace}
                        disabled={isLoading}
                        className="w-full h-12 text-lg gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        Criar Minha Carteira
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
