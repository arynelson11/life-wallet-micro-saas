"use client";

import { useSearchParams } from "next/navigation";
import { SettingsNav } from "./SettingsNav";
import { User, Users, Shield, CreditCard } from "lucide-react";

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export const SETTINGS_TABS = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "subscription", label: "Assinatura", icon: CreditCard },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "family", label: "Família/Time", icon: Users },
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "profile";

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                    <span>Dashboard</span>
                    <span className="text-zinc-700">/</span>
                    <span className="text-primary">Configurações</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Configurações
                </h1>
                <p className="text-zinc-400 mt-1">Gerencie sua conta e preferências.</p>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Left Sidebar (Navigation) */}
                <div className="md:col-span-3 lg:col-span-2">
                    <SettingsNav activeTab={activeTab} />
                </div>

                {/* Right Content */}
                <div className="md:col-span-9 lg:col-span-10">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-black/40 min-h-[600px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
