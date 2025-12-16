"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileHeaderProps {
    user: any;
    profile: any;
}

export function MobileHeader({ user, profile }: MobileHeaderProps) {
    const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário';

    return (
        <div className="flex justify-between items-center p-6 bg-black sticky top-0 z-50 border-b border-zinc-900/50 backdrop-blur-md supports-[backdrop-filter]:bg-black/80">
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-zinc-800">
                    <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-zinc-800 text-zinc-400 font-medium">
                        {user?.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-zinc-400 text-xs font-medium">Bem-vindo,</span>
                    <span className="font-bold text-white text-base tracking-tight">{firstName}</span>
                </div>
            </div>
            
            <button className="relative p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors active:scale-95">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-zinc-900"></span>
            </button>
        </div>
    );
}
