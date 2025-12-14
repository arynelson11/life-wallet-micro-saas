"use client";

import Link from "next/link";
import { SETTINGS_TABS } from "./SettingsLayout";
import { cn } from "@/lib/utils";

interface SettingsNavProps {
    activeTab: string;
}

export function SettingsNav({ activeTab }: SettingsNavProps) {
    return (
        <nav className="flex flex-col space-y-1">
            {SETTINGS_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <Link
                        key={tab.id}
                        href={`/settings?tab=${tab.id}`}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-primary/10 text-primary shadow-[0_0_20px_-5px_rgba(74,222,128,0.3)] border border-primary/20"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-zinc-500 group-hover:text-white")} />
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
