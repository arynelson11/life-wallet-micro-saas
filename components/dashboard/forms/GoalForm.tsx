"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Plus, Target, Trash2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { createGoal, updateGoal, deleteGoal } from "@/actions/finance-actions";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface GoalFormProps {
    initialData?: {
        id: string;
        title: string;
        target_amount: number;
        current_amount: number;
        status: "active" | "completed";
        image_url?: string | null;
    };
    spaceId: string;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function GoalForm({ initialData, spaceId, trigger, onSuccess }: GoalFormProps) {
    const isEdit = !!initialData;
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null);

    // Supabase client for upload
    const supabase = createClient();

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        target_amount: initialData?.target_amount || "",
        current_amount: initialData?.current_amount || "",
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Upload Image logic (Copy from GoalDialog logic)
            let imageUrl = initialData?.image_url || ""; // Default to existing
            if (selectedImage) {
                const fileExt = selectedImage.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('goal-images')
                    .upload(filePath, selectedImage);

                if (uploadError) {
                    throw new Error("Erro de Upload: " + uploadError.message);
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('goal-images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            } else if (previewUrl === null) {
                // User explicitly cleared the image
                imageUrl = "";
            }

            const payload = {
                space_id: spaceId,
                title: formData.title,
                target_amount: Number(formData.target_amount),
                current_amount: Number(formData.current_amount),
                status: 'active',
                image_url: imageUrl || null // Send null if empty
            };

            if (!spaceId) {
                toast.error("Erro: Espaço não identificado.");
                setIsLoading(false);
                return;
            }

            let result;
            if (isEdit && initialData) {
                result = await updateGoal(initialData.id, payload);
            } else {
                result = await createGoal(payload);
            }

            if (!result.success) throw new Error(result.error);

            toast.success(isEdit ? "Meta atualizada!" : "Meta criada!");
            setOpen(false);
            if (!isEdit) {
                setFormData({ title: "", target_amount: "", current_amount: "" });
                setPreviewUrl(null);
                setSelectedImage(null);
            }
            onSuccess?.();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erro ao salvar meta");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (!confirm("Excluir esta meta?")) return;
        setIsLoading(true);
        try {
            const result = await deleteGoal(initialData.id);
            if (!result.success) throw new Error(result.error);

            toast.success("Meta excluída!");
            setOpen(false);
            onSuccess?.();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erro ao excluir");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="rounded-full gap-2 font-semibold bg-primary text-black hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                        Nova Meta
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] sm:max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar Meta" : "Nova Meta / Investimento"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Nome da Meta</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Reserva de Emergência"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Image Upload Area */}
                    <div className="space-y-2">
                        <Label>Imagem de Capa (Opcional)</Label>
                        {!previewUrl ? (
                            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-zinc-50 transition-colors cursor-pointer relative h-32">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageSelect}
                                />
                                <ImageIcon className="w-6 h-6 text-zinc-400 mb-1" />
                                <p className="text-xs text-zinc-500 font-medium">Trocar/Adicionar Imagem</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-zinc-200 group">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current">Valor Atual</Label>
                            <Input
                                id="current"
                                type="number"
                                step="0.01"
                                required
                                value={formData.current_amount}
                                onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="target">Meta (Alvo)</Label>
                            <Input
                                id="target"
                                type="number"
                                step="0.01"
                                required
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        {isEdit && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button type="submit" disabled={isLoading} className="ml-auto">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Salvar" : "Criar Meta"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
