import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-primary mx-auto mb-6 shadow-lg shadow-primary/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Bem-vindo de volta</h1>
                    <p className="text-muted-foreground">Entre na sua conta para continuar</p>
                </div>

                <div className="glass-panel p-8 rounded-[2rem] border-white/20 shadow-xl">
                    <LoginForm />
                </div>

                <p className="text-center mt-8 text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link href="/signup" className="font-medium text-primary hover:underline">
                        Criar conta
                    </Link>
                </p>
            </div>
        </div>
    );
}