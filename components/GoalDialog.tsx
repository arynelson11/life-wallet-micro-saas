'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plane, Car, Home, GraduationCap, Shield, Plus, Loader2 } from "lucide-react";
import { createGoal } from "@/app/actions/goals"; // Importando a ação que criamos acima

// Lista de Ícones Predefinidos
const PRESET_ICONS = [
    { id: 'plane', label: 'Viagem', icon: Plane },
    { id: 'car', label: 'Carro', icon: Car },
    { id: 'home', label: 'Casa', icon: Home },
    { id: 'education', label: 'Estudo', icon: GraduationCap },
    { id: 'safety', label: 'Reserva', icon: Shield },
];

export function GoalDialog({ spaceId }: { spaceId: string }) {
    const [open, setOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("plane");
    const [customEmoji, setCustomEmoji] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        // Se o usuário digitou um emoji, usa ele. Se não, usa o ícone selecionado.
        const iconToSave = customEmoji || selectedIcon;
        formData.append("icon", iconToSave);
        formData.append("space_id", spaceId);

        await createGoal(formData);

        setIsLoading(false);
        setOpen(false); // Fecha o modal
        setCustomEmoji(""); // Limpa form
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-500 text-white">
                    <Plus className="h-4 w-4" /> Nova Meta
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nova Meta 🚀</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-6 mt-4">

                    {/* Nome da Meta */}
                    <div className="space-y-2">
                        <Label>Nome do Objetivo</Label>
                        <Input name="title" placeholder="Ex: Viagem para Disney" required />
                    </div>

                    {/* Valor */}
                    <div className="space-y-2">
                        <Label>Valor Alvo (R$)</Label>
                        <Input name="target_amount" type="number" placeholder="5000" required />
                    </div>

                    {/* Seleção de Ícone */}
                    <div className="space-y-3">
                        <Label>Escolha um Ícone ou Emoji</Label>

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
                                                ? "border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-600 ring-offset-1"
                                                : "border-zinc-200 hover:bg-zinc-50 text-zinc-500"
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
                                <span className="text-zinc-400 text-sm">Ou digite um emoji:</span>
                            </div>
                            <Input
                                placeholder="Ex: 💻, 💍, 🐶"
                                className="pl-36 text-lg"
                                value={customEmoji}
                                onChange={(e) => setCustomEmoji(e.target.value)}
                                maxLength={2}
                            />
                        </div>
                    </div>

                    {/* Botão Salvar */}
                    <Button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Criar Meta"}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    );
}