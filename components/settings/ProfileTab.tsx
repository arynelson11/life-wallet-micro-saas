"use client";

import { useTransition, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/profile";
import { Loader2, User, Camera } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ProfileTabProps {
    user: any;
    profile: any;
}

export function ProfileTab({ user, profile }: ProfileTabProps) {
    const [isPending, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
    const [supabase] = useState(() => createClient());

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // 3. Update Local State
            setAvatarUrl(data.publicUrl);

            toast.success("Imagem enviada! Clique em 'Salvar Alterações' para confirmar.");

        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast.error("Erro ao enviar imagem. Verifique se é pequena (max 2MB).");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            // Append avatar URL to form data explicitly if not present in input, 
            // but since we render it in defaultValue, it should be fine? 
            // Actually, controlled inputs or hidden inputs are safer.
            // We will rely on get('avatarUrl') from the hidden input.
            try {
                await updateProfile(formData);
                toast.success("Perfil atualizado com sucesso!");
            } catch (e: any) {
                console.error(e);
                toast.error(`Erro ao atualizar: ${e.message}`);
            }
        });
    };

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        : user.email?.substring(0, 2).toUpperCase();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Informações Pessoais</h2>
                <p className="text-zinc-400 text-sm">Atualize sua foto e dados pessoais aqui.</p>
            </div>

            <form action={handleSubmit} className="space-y-8 max-w-xl">

                {/* Hidden Input for Avatar URL */}
                <input type="hidden" name="avatarUrl" value={avatarUrl || ""} />

                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                    <div className="relative group cursor-pointer overflow-hidden rounded-full">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-24 h-24 object-cover rounded-full border-2 border-zinc-800" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center text-3xl font-bold text-zinc-400 group-hover:border-primary/50 transition-colors">
                                {initials}
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                            {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                        </div>
                    </div>
                    <div>
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-full border-zinc-700 hover:border-zinc-500 text-white hover:bg-zinc-800"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                            disabled={uploading}
                        >
                            {uploading ? "Enviando..." : "Alterar Foto"}
                        </Button>
                        <p className="text-xs text-zinc-500 mt-2">Recomendado: 400x400px (Max 2MB)</p>
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={uploading}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-zinc-300">Nome Completo</Label>
                        <div className="relative">
                            <Input
                                name="fullName"
                                placeholder="Seu nome"
                                defaultValue={profile?.full_name || ""}
                                className="h-12 rounded-xl bg-zinc-900/50 border-white/10 focus:ring-primary pl-10"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-zinc-300">Telefone / WhatsApp</Label>
                        <Input
                            name="phone"
                            placeholder="(11) 99999-9999"
                            defaultValue={profile?.phone || ""}
                            className="h-12 rounded-xl bg-zinc-900/50 border-white/10 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-300">E-mail</Label>
                    <Input disabled value={user.email || ""} className="h-12 rounded-xl bg-zinc-900/30 text-zinc-500 border-white/5 cursor-not-allowed" />
                    <p className="text-xs text-zinc-500">O e-mail não pode ser alterado pois é sua chave de acesso.</p>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button disabled={isPending || uploading} type="submit" className="h-12 px-8 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(74,222,128,0.4)] transition-all">
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
