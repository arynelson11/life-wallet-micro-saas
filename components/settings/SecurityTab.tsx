"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SecurityTab() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const supabase = createClient();

    const handlePasswordChange = (formData: FormData) => {
        startTransition(async () => {
            const password = formData.get("password") as string;
            const confirm = formData.get("confirm") as string;

            if (password !== confirm) {
                toast.error("As senhas não coincidem.");
                return;
            }

            if (password.length < 6) {
                toast.error("A senha deve ter no mínimo 6 caracteres.");
                return;
            }

            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Senha atualizada com sucesso!");
                // Optionally sign out or simple notify
            }
        });
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 max-w-xl">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Segurança</h2>
                <p className="text-zinc-400 text-sm">Gerencie sua senha e acesso.</p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Alterar Senha</h3>
                        <p className="text-xs text-zinc-500">Escolha uma senha forte para proteger sua conta.</p>
                    </div>
                </div>

                <form action={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-zinc-400">Nova Senha</Label>
                        <div className="relative">
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-11 rounded-xl bg-zinc-950/50 border-white/10 focus:ring-primary pl-10"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-zinc-400">Confirmar Nova Senha</Label>
                        <div className="relative">
                            <Input
                                name="confirm"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-11 rounded-xl bg-zinc-950/50 border-white/10 focus:ring-primary pl-10"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        </div>
                    </div>
                    <Button disabled={isPending} type="submit" className="w-full h-11 rounded-xl bg-white/10 text-white hover:bg-white/20 font-medium">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Senha"}
                    </Button>
                </form>
            </div>

            <div className="pt-8 border-t border-white/5">
                <h3 className="text-sm font-bold text-white mb-2 text-red-500">Zona de Perigo</h3>
                <Button variant="outline" onClick={handleSignOut} className="w-full h-11 rounded-xl border-red-900/30 text-red-500 bg-red-900/5 hover:bg-red-900/20 hover:text-red-400 transition-colors">
                    Sair de todas as sessões
                </Button>
            </div>
        </div>
    );
}
