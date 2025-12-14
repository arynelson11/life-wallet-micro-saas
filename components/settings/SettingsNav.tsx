"use client";

import { SETTINGS_TABS } from "./SettingsLayout";
import { cn } from "@/lib/utils";

interface SettingsNavProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
    return (
        <nav className="flex flex-col space-y-1">
            {SETTINGS_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left",
                            isActive
                                ? "bg-primary/10 text-primary shadow-[0_0_20px_-5px_rgba(74,222,128,0.3)] border border-primary/20"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-zinc-500 group-hover:text-white")} />
                        {tab.label}
                    </button>
                );
            })}
        </nav>
    );
}
