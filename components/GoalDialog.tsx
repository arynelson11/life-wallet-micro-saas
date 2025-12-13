'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane, Car, Home, GraduationCap, Shield, Plus, Loader2, Image as ImageIcon, X } from "lucide-react";
import { createGoal } from "@/app/actions/goals";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

// Lista de Ícones Predefinidos
const PRESET_ICONS = [
    { id: 'plane', label: 'Viagem', icon: Plane },
    { id: 'car', label: 'Carro', icon: Car },
    { id: 'home', label: 'Casa', icon: Home },
    { id: 'education', label: 'Estudo', icon: GraduationCap },
    { id: 'safety', label: 'Reserva', icon: Shield },
];

interface GoalDialogProps {
    spaceId?: string;
    children?: React.ReactNode;
}

export function GoalDialog({ spaceId, children }: GoalDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("plane");
    const [customEmoji, setCustomEmoji] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const supabase = createClient();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        try {
            // 1. Upload Image if selected
            let imageUrl = "";
            if (selectedImage) {
                const fileExt = selectedImage.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('goal-images')
                    .upload(filePath, selectedImage);

                if (uploadError) {
                    throw new Error("Erro ao fazer upload da imagem: " + uploadError.message);
                }

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('goal-images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            // 2. Prepare Form Data
            const iconToSave = customEmoji || selectedIcon;
            formData.append("icon", iconToSave);
            if (imageUrl) {
                formData.append("image_url", imageUrl);
            }
            if (spaceId) {
                formData.append("space_id", spaceId);
            }

            await createGoal(formData);

            toast.success("Meta criada com sucesso!");
            setOpen(false);
            setCustomEmoji("");
            setPreviewUrl(null);
            setSelectedImage(null);

        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar meta. Verifique se o bucket 'goal-images' existe e é público.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="gap-2 bg-black hover:bg-black/90 text-white rounded-full">
                        <Plus className="h-4 w-4" /> Nova Meta
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-[2rem] border-border shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Nova Meta 🚀</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-6 mt-4">

                    {/* Nome da Meta */}
                    <div className="space-y-2">
                        <Label>Nome do Objetivo</Label>
                        <Input name="title" placeholder="Ex: Viagem para Disney" required className="rounded-xl" />
                    </div>

                    {/* Valor */}
                    <div className="space-y-2">
                        <Label>Valor Alvo (R$)</Label>
                        <Input name="target_amount" type="number" placeholder="5000" required className="rounded-xl" />
                    </div>

                    {/* Imagem de Capa (Opcional) */}
                    <div className="space-y-2">
                        <Label>Imagem de Capa (Opcional)</Label>

                        {!previewUrl ? (
                            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-50 transition-colors cursor-pointer relative">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageSelect}
                                />
                                <ImageIcon className="w-8 h-8 text-zinc-400 mb-2" />
                                <p className="text-sm text-zinc-500 font-medium">Clique para escolher uma imagem</p>
                                <p className="text-xs text-zinc-400">JPG, PNG, WebP (Max 2MB)</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-zinc-200 group">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Seleção de Ícone */}
                    <div className="space-y-3">
                        <Label>Ou escolha um Ícone</Label>

                        <div className="grid grid-cols-5 gap-2">
                            {PRESET_ICONS.map((item) => {
                                const Icon = item.icon;
                                const isSelected = selectedIcon === item.id && !customEmoji;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => { setSelectedIcon(item.id); setCustomEmoji(""); }}
                                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${isSelected
                                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-1"
                                            : "border-border hover:bg-secondary text-muted-foreground"
                                            }`}
                                    >
                                        <Icon className="h-6 w-6 mb-1" />
                                        <span className="text-[10px] font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Input de Emoji Customizado */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-muted-foreground text-sm">Ou digite um emoji:</span>
                            </div>
                            <Input
                                placeholder="Ex: 💻, 💍, 🐶"
                                className="pl-36 text-lg rounded-xl"
                                value={customEmoji}
                                onChange={(e) => setCustomEmoji(e.target.value)}
                                maxLength={2}
                            />
                        </div>
                    </div>

                    {/* Botão Salvar */}
                    <Button disabled={isLoading} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 rounded-xl">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Criar Meta"}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
}