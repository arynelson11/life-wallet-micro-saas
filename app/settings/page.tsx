import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinSpace } from "@/app/actions/transactions";
import { updateProfile } from "@/app/actions/profile";
import { User, Users, LogOut, Copy, CreditCard } from "lucide-react";
import { createCustomerPortal, createCheckoutSession, createCustomerPortalSession } from "@/app/actions/stripe";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Busca dados do perfil e do space
    // USA maybeSingle() PARA EVITAR CRASH SE NÃO TIVER PERFIL AINDA
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

    const { data: spaceMember } = await supabase
        .from("space_members")
        .select("space_id, spaces(name, invite_code)")
        .eq("user_id", user.id)
        .maybeSingle();

    // @ts-ignore
    const inviteCode = spaceMember?.spaces?.invite_code || "---";

    // Check if Stripe is configured
    const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

    async function handleJoin(formData: FormData) {
        'use server'
        const code = formData.get('code') as string;
        await joinSpace(code);
        redirect('/dashboard');
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 pb-32 md:pb-10">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Configurações</h1>
                    <p className="text-zinc-500">Gerencie seu perfil e sua família.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* --- SEÇÃO DE ASSINATURA (NOVA) --- */}
                <div className="col-span-full">
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 p-2 rounded-lg"><CreditCard className="h-5 w-5 text-white" /></div>
                                <CardTitle className="text-blue-900">Assinatura</CardTitle>
                            </div>
                            <CardDescription>
                                {isStripeConfigured
                                    ? "Gerencie seu plano e cobrança."
                                    : "⚠️ Stripe não configurado. Configure no .env.local para habilitar pagamentos."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <p className="font-medium text-zinc-900">Plano Atual: <span className="font-bold text-blue-600">{profile?.plan_type || 'SOLO'}</span></p>
                                <p className="text-sm text-zinc-500">Status: <span className={`font-bold uppercase ${profile?.subscription_status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>{profile?.subscription_status || 'trial'}</span></p>
                            </div>

                            {profile?.subscription_status === 'trial' ? (
                                <form action={async () => {
                                    'use server'
                                    if (!process.env.STRIPE_SECRET_KEY) return;
                                    await createCheckoutSession("price_1Q...");
                                }}>
                                    <Button
                                        disabled={!isStripeConfigured}
                                        className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isStripeConfigured ? "Assinar Agora" : "⚠️ Stripe não configurado"}
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
                                        className="bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isStripeConfigured ? "Gerenciar Assinatura / Alterar Plano" : "⚠️ Stripe não configurado"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* --- COLUNA 1: PERFIL PESSOAL --- */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-zinc-200">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 p-2 rounded-lg"><User className="h-5 w-5 text-blue-600" /></div>
                                <CardTitle>Meu Perfil</CardTitle>
                            </div>
                            <CardDescription>Como você quer ser chamado no app.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={updateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome Completo</Label>
                                    <Input
                                        name="fullName"
                                        placeholder="Seu nome"
                                        defaultValue={profile?.full_name || ""}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-mail</Label>
                                    <Input disabled value={user.email || ""} className="bg-zinc-50 text-zinc-500" />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                                    Salvar Alterações
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

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
                    <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 p-2 rounded-lg"><Users className="h-5 w-5 text-white" /></div>
                                <CardTitle className="text-blue-900">Convidar Parceiro(a)</CardTitle>
                            </div>
                            <CardDescription className="text-blue-600/80">Compartilhe este código para dividir as contas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center">
                            <div className="bg-white p-4 rounded-xl border-2 border-blue-200 border-dashed relative group cursor-pointer hover:border-blue-400 transition-colors">
                                <code className="text-3xl font-mono font-bold text-blue-600 tracking-widest select-all">
                                    {inviteCode}
                                </code>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-blue-400">
                                    <Copy className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-xs text-blue-400 font-medium">Toque no código para copiar</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-zinc-200">
                        <CardHeader>
                            <CardTitle className="text-base">Entrar em outro Grupo</CardTitle>
                            <CardDescription>Tem um código? Cole abaixo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={handleJoin} className="flex gap-2">
                                <Input name="code" placeholder="Código (Ex: 12345)" required className="bg-white" />
                                <Button type="submit" variant="secondary">Entrar</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}