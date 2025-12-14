"use client";

import { useState } from "react";
import { SettingsNav } from "./SettingsNav";
import { User, Users, Shield, CreditCard } from "lucide-react";

// Components passed as props or imported?
// To make it fully client-side switching without prop drilling hell from page, 
// we will accept the *data* as props and render the tabs here.
// But `SettingsPage` was passing children. 
// We will change the pattern: SettingsPage passes DATA, SettingsLayout renders TABS.

import { ProfileTab } from "./ProfileTab";
import { SubscriptionTab } from "./SubscriptionTab";
import { SecurityTab } from "./SecurityTab";
import { FamilyTab } from "./FamilyTab";

export const SETTINGS_TABS = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "subscription", label: "Assinatura", icon: CreditCard },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "family", label: "Família/Time", icon: Users },
];

interface SettingsLayoutProps {
    user: any;
    profile: any;
    inviteCode: string;
    isStripeConfigured: boolean;
}

export function SettingsLayout({ user, profile, inviteCode, isStripeConfigured }: SettingsLayoutProps) {
    const [activeTab, setActiveTab] = useState("profile");

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
                    <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Right Content */}
                <div className="md:col-span-9 lg:col-span-10">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-black/40 min-h-[600px]">
                        {activeTab === 'profile' && <ProfileTab user={user} profile={profile} />}
                        {activeTab === 'subscription' && <SubscriptionTab profile={profile} isStripeConfigured={isStripeConfigured} />}
                        {activeTab === 'security' && <SecurityTab />}
                        {activeTab === 'family' && <FamilyTab inviteCode={inviteCode} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
