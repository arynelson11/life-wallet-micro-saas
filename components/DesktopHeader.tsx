'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DesktopHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
    };

    const isActive = (path: string) => pathname === path ? "text-blue-600 font-bold bg-blue-50" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100";

    return (
        <header className="hidden md:flex fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 z-50 h-16 items-center px-6 justify-between transition-all duration-300">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-xl shadow-sm shadow-blue-200">
                    <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-zinc-900 tracking-tight">LifeWallet</span>
            </div>

            <nav className="flex gap-2">
                <Link href="/dashboard" className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive('/dashboard')}`}>
                    Dashboard
                </Link>
                <Link href="/metas" className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive('/metas')}`}>
                    Metas & Sonhos
                </Link>
                <Link href="/calendario" className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive('/calendario')}`}>
                    Calendário
                </Link>
                <Link href="/settings" className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive('/settings')}`}>
                    Configurações
                </Link>
            </nav>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair" className="hover:bg-red-50 hover:text-red-500">
                    <LogOut className="h-5 w-5" />
                </Button>
                <Link href="/settings">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all ${pathname === '/settings' ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200'}`}>
                        <User className="h-5 w-5" />
                    </div>
                </Link>
            </div>
        </header>
    );
}