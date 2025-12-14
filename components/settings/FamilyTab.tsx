"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinSpace } from "@/app/actions/transactions";
import { Copy, Users, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FamilyTabProps {
    inviteCode: string;
}

export function FamilyTab({ inviteCode }: FamilyTabProps) {
    const router = useRouter();

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        toast.success("Código copiado!");
    };

    const handleJoin = async (formData: FormData) => {
        try {
            const code = formData.get('code') as string;
            await joinSpace(code);
            toast.success("Você entrou no grupo com sucesso!");
            router.push('/dashboard');
        } catch (error) {
            toast.error("Erro ao entrar no grupo. Verifique o código.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 max-w-2xl">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Família & Compartilhamento</h2>
                <p className="text-zinc-400 text-sm">Convide pessoas para gerenciar as finanças com você.</p>
            </div>

            {/* Invite Section */}
            <div className="glass-panel p-6 rounded-2xl bg-primary/5 border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-white">Seu Código de Convite</h3>
                    </div>

                    <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                        Envie este código para quem você quer convidar. Eles terão acesso total ao seu Dashboard para lançar gastos e metas juntos.
                    </p>

                    <div onClick={handleCopy} className="bg-black/40 p-4 rounded-xl border-2 border-dashed border-zinc-700/50 hover:border-primary/50 cursor-pointer group transition-all flex items-center justify-between">
                        <code className="text-2xl font-mono font-bold text-white tracking-widest pl-2">
                            {inviteCode}
                        </code>
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors text-zinc-400">
                            <Copy className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 text-center">Clique para copiar</p>
                </div>
            </div>

            {/* Join Section */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                        <LogIn className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Entrar em outro Grupo</h3>
                        <p className="text-xs text-zinc-500">Tem um convite? Cole o código abaixo.</p>
                    </div>
                </div>

                <form action={handleJoin} className="flex gap-3">
                    <Input
                        name="code"
                        placeholder="Código (Ex: 12345)"
                        required
                        className="h-12 rounded-xl bg-zinc-950 border-white/10 focus:ring-primary flex-1"
                    />
                    <Button type="submit" variant="secondary" className="h-12 rounded-xl px-6 font-bold bg-white text-black hover:bg-zinc-200">
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    );
}
