import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/app/actions/profile";
import { User, Mail, ShieldAlert } from "lucide-react";
import { Toaster } from "sonner";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <Header user={user} />
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
                            <p className="text-muted-foreground">Gerencie suas informações pessoais e segurança.</p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                            <CardDescription>Atualize seu nome e veja seu email de cadastro.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={updateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" value={user.email} disabled className="pl-10 bg-muted" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nome Completo</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        defaultValue={profile?.full_name || user.user_metadata?.full_name}
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Salvar Alterações</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100 dark:border-red-900/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <ShieldAlert className="h-5 w-5" />
                                Segurança
                            </CardTitle>
                            <CardDescription>Gerencie sua senha e acesso.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div>
                                    <p className="font-medium">Senha</p>
                                    <p className="text-sm text-muted-foreground">Recomendamos trocar sua senha periodicamente.</p>
                                </div>
                                <Button variant="outline">Redefinir Senha</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
