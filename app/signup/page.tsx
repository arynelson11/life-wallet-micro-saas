'use client'

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Wallet, Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const supabase = createClient();
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        if (password.length < 6) {
            setErrorMsg("A senha precisa ter pelo menos 6 caracteres.");
            setIsLoading(false);
            return;
        }

        // 1. Cria a conta no Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Redireciona para o dashboard após confirmar email (se necessário)
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) {
            setErrorMsg(error.message);
            setIsLoading(false);
        } else {
            // Sucesso!
            // Se o Supabase estiver configurado sem confirmação de email, já logamos o usuário.
            if (data.session) {
                router.push("/dashboard");
            } else {
                // Se precisar confirmar email
                setSuccessMsg("Conta criada com sucesso! Verifique seu e-mail para confirmar.");
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2">

            {/* --- COLUNA ESQUERDA (Branding - Variação para Cadastro) --- */}
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
                        Comece sua jornada<br />
                        <span className="text-blue-200">Financeira.</span>
                    </h1>
                    <p className="text-blue-100 text-lg max-w-md mb-12">
                        Junte-se a milhares de casais e solteiros que já organizaram suas vidas.
                    </p>

                    <div className="space-y-4 max-w-sm">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105">
                            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-bold text-blue-900">Conta Gratuita</p>
                                <p className="text-xs text-blue-700">Sem cartão de crédito necessário</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 text-xs text-blue-300">© 2024 LifeWallet Inc.</div>
            </div>

            {/* --- COLUNA DIREITA (Formulário Cadastro) --- */}
            <div className="flex flex-col justify-center items-center p-8 bg-zinc-950 text-white">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Crie sua conta</h2>
                        <p className="text-zinc-400 mt-2">Preencha os dados abaixo para começar.</p>
                    </div>

                    {/* Mensagens de Erro ou Sucesso */}
                    {errorMsg && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3 text-green-400 text-sm">
                            <CheckCircle className="h-5 w-5 flex-shrink-0" />
                            {successMsg}
                        </div>
                    )}

                    {/* Formulário */}
                    <form className="space-y-4" onSubmit={handleSignUp}>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Seu E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                                className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Crie uma Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                required
                            />
                        </div>

                        <Button disabled={isLoading} className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg mt-6 shadow-lg shadow-blue-900/20">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Cadastrar Gratuitamente"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-zinc-400">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="font-semibold text-white hover:text-blue-400 hover:underline transition-colors">
                            Fazer Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}