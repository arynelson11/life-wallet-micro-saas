'use client'

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Wallet, Check, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const supabase = createClient();
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            setErrorMsg("Google Login não configurado no Supabase.");
            setIsLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            if (signInError.message.includes("Invalid login credentials")) {
                setErrorMsg("E-mail ou senha incorretos.");
            } else {
                setErrorMsg(signInError.message);
            }
            setIsLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    // Função para cadastrar (mantida para referência, mas o botão usa Link agora)
    const handleSignUp = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            setErrorMsg(error.message);
        } else {
            setErrorMsg("Conta criada! Verifique seu e-mail ou entre agora.");
            await handleEmailLogin({ preventDefault: () => { } } as any);
        }
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2">

            {/* --- COLUNA ESQUERDA (Branding) --- */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-black">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-900 to-black opacity-80 z-0"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                            <Wallet className="h-6 w-6 text-blue-700" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">LifeWallet</span>
                    </div>

                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
                        Sua vida financeira,<br />
                        <span className="text-blue-200">Simplificada.</span>
                    </h1>
                    <p className="text-blue-100 text-lg max-w-md mb-12">
                        O controle que você precisa, com a facilidade de uma conversa no WhatsApp.
                    </p>

                    <div className="space-y-4 max-w-sm">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105">
                            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                            <div>
                                <p className="font-bold text-blue-900">Crie sua conta</p>
                                <p className="text-xs text-blue-700">Comece em segundos</p>
                            </div>
                            <Check className="ml-auto h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="relative z-10 text-xs text-blue-300">© 2024 LifeWallet Inc.</div>
            </div>

            {/* --- COLUNA DIREITA (Formulário Funcional) --- */}
            <div className="flex flex-col justify-center items-center p-8 bg-zinc-950 text-white">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Acesse sua conta</h2>
                        <p className="text-zinc-400 mt-2">Entre com seus dados.</p>
                    </div>

                    {errorMsg && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {errorMsg}
                        </div>
                    )}

                    {/* Botão Google */}
                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="h-12 border-zinc-800 bg-transparent text-white hover:bg-zinc-900 flex gap-3 rounded-xl">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M12.0003 20.45c-4.6667 0-8.45-3.7833-8.45-8.45 0-4.6667 3.7833-8.45 8.45-8.45 2.1833 0 4.2833.85 5.8667 2.3833l-2.2833 2.2833c-.7667-.7333-1.95-1.4667-3.5833-1.4667-2.9167 0-5.2667 2.3667-5.2667 5.25s2.35 5.25 5.2667 5.25c2.6167 0 4.3833-1.55 4.75-4.35h-4.75v-2.9h7.8833c.1.5333.15 1.0667.15 1.6333 0 5.1667-3.4667 8.8167-8.0334 8.8167z" fill="currentColor" /></svg>
                            Continuar com Google
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-500">Ou use e-mail</span></div>
                    </div>

                    {/* Formulário FUNCIONAL */}
                    <form className="space-y-4" onSubmit={handleEmailLogin}>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                                required
                            />
                        </div>

                        <Button disabled={isLoading} className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg mt-4">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
                        </Button>
                    </form>

                    {/* Botão de Cadastro (Link para /signup) */}
                    <p className="text-center text-sm text-zinc-400 mt-6">
                        Ainda não tem conta?{" "}
                        <Link href="/signup" className="font-semibold text-white hover:text-blue-400 hover:underline transition-colors">
                            Cadastre-se agora
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}