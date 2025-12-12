import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinSpace } from "@/app/actions/transactions";
import { updateProfile } from "@/app/actions/profile";
import { User, Users, LogOut, Copy, CreditCard, Settings } from "lucide-react";
import { createCheckoutSession, createCustomerPortalSession } from "@/app/actions/stripe";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

    const { data: spaceMember } = await supabase
        .from("space_members")
        .select("space_id, spaces(name, invite_code)")
        .eq("user_id", user.id)
        .maybeSingle();

    // @ts-ignore
    const inviteCode = spaceMember?.spaces?.invite_code || "---";
    const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

    async function handleJoin(formData: FormData) {
        'use server'
        const code = formData.get('code') as string;
        await joinSpace(code);
        redirect('/dashboard');
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Configurações</span>
                    </div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">
                        Configurações
                    </h1>
                    <p className="text-muted-foreground mt-1">Gerencie seu perfil e sua família.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* --- SEÇÃO DE ASSINATURA --- */}
                <div className="col-span-full">
                    <div className="orvion-card p-8 bg-black text-white border-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Assinatura</h2>
                                </div>
                                <p className="text-zinc-400 max-w-md mb-6">
                                    {isStripeConfigured
                                        ? "Gerencie seu plano e cobrança."
                                        : "⚠️ Stripe não configurado. Configure no .env.local para habilitar pagamentos."}
                                </p>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Plano Atual</p>
                                        <p className="font-bold text-xl text-primary">{profile?.plan_type || 'SOLO'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Status</p>
                                        <p className={`font-bold text-xl uppercase ${profile?.subscription_status === 'active' ? 'text-green-400' : 'text-amber-400'}`}>
                                            {profile?.subscription_status || 'trial'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                {profile?.subscription_status === 'trial' ? (
                                    <form action={async () => {
                                        'use server'
                                        if (!process.env.STRIPE_SECRET_KEY) return;
                                        await createCheckoutSession("price_1Q...");
                                    }}>
                                        <Button
                                            disabled={!isStripeConfigured}
                                            className="w-full md:w-auto h-12 rounded-full bg-primary text-black hover:bg-primary/90 font-bold px-8"
                                        >
                                            {isStripeConfigured ? "Assinar Agora" : "⚠️ Configurar Stripe"}
                                        </Button>
                                    </form>
                                ) : (
                                    <form action={async () => {
                                        'use server'
                                        if (!process.env.STRIPE_SECRET_KEY) return;
                                        await createCustomerPortalSession();
                                    }}>
                                        <Button
                                            disabled={!isStripeConfigured}
                                            variant="outline"
                                            className="w-full md:w-auto h-12 rounded-full border-white/20 text-white hover:bg-white/10"
                                        >
                                            {isStripeConfigured ? "Gerenciar Assinatura" : "⚠️ Configurar Stripe"}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLUNA 1: PERFIL PESSOAL --- */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Meu Perfil</h3>
                                <p className="text-sm text-muted-foreground">Como você quer ser chamado.</p>
                            </div>
                        </div>

                        <form action={updateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input
                                    name="fullName"
                                    placeholder="Seu nome"
                                    defaultValue={profile?.full_name || ""}
                                    className="h-12 rounded-xl bg-white/50 border-zinc-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>E-mail</Label>
                                <Input disabled value={user.email || ""} className="h-12 rounded-xl bg-zinc-50 text-zinc-500 border-zinc-200" />
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-xl bg-black text-white hover:bg-black/90 font-medium mt-2">
                                Salvar Alterações
                            </Button>
                        </form>
                    </div>

                    <form action={async () => {
                        'use server';
                        const sb = await createClient();
                        await sb.auth.signOut();
                        redirect('/login');
                    }}>
                        <Button variant="outline" className="w-full gap-2 rounded-xl h-12 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                            <LogOut className="h-4 w-4" /> Sair da Conta
                        </Button>
                    </form>
                </div>

                {/* --- COLUNA 2: FAMÍLIA & CONVITES --- */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Convidar Parceiro(a)</h3>
                                <p className="text-sm text-muted-foreground">Compartilhe este código.</p>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <div className="bg-zinc-50 p-6 rounded-2xl border-2 border-dashed border-zinc-200 relative group cursor-pointer hover:border-primary transition-colors">
                                <code className="text-3xl font-mono font-bold text-black tracking-widest select-all">
                                    {inviteCode}
                                </code>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-primary">
                                    <Copy className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium mt-2">Toque no código para copiar</p>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-zinc-100 rounded-xl">
                                <Settings className="h-5 w-5 text-zinc-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Entrar em outro Grupo</h3>
                                <p className="text-sm text-muted-foreground">Tem um código? Cole abaixo.</p>
                            </div>
                        </div>

                        <form action={handleJoin} className="flex gap-2">
                            <Input name="code" placeholder="Código (Ex: 12345)" required className="h-12 rounded-xl bg-white/50 border-zinc-200" />
                            <Button type="submit" variant="secondary" className="h-12 rounded-xl px-6">Entrar</Button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}