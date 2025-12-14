"use client";

import { Search, Bell, Calendar as CalendarIcon, Plus, LayoutGrid, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ReportDialog } from "@/components/dashboard/ReportDialog";

interface HeaderProps {
    user?: any;
}

export function Header({ user }: HeaderProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isWidgetOpen, setIsWidgetOpen] = useState(false);

    // Search
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace, push } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    // Logout
    const handleLogout = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Erro ao sair.");
        } else {
            push("/login");
        }
    };

    // Notifications State
    const [unreadCount, setUnreadCount] = useState(2);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "Conta de Luz Vencendo", desc: "Sua fatura de R$ 250 vence amanhã.", color: "bg-blue-500", read: false },
        { id: 2, title: "Meta Atingida!", desc: "Você atingiu 50% da meta 'Viagem'.", color: "bg-green-500", read: false }
    ]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success("Todas as notificações marcadas como lidas.");
    };

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pt-4 gap-4">
            {/* Title Section */}
            <div>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>Vendas</span>
                    <span>/</span>
                    <span>Produtos Digitais</span>
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-foreground tracking-tight">
                    Performance de Vendas
                </h1>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar transações..."
                        className="h-10 pl-10 pr-4 rounded-full bg-background border border-input shadow-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                        defaultValue={searchParams.get('q')?.toString()}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                {/* Report Dialog */}
                <div className="hidden md:block">
                    <ReportDialog />
                </div>

                {/* Date Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="hidden md:flex h-10 rounded-full border-input shadow-sm bg-background text-foreground hover:bg-accent px-4 gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{date ? format(date, "dd MMM yyyy", { locale: ptBR }) : "Escolha uma data"}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Add Widget Button */}
                <Dialog open={isWidgetOpen} onOpenChange={setIsWidgetOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="hidden md:flex h-10 rounded-full border-input shadow-sm bg-background hover:bg-accent gap-2">
                            <Plus className="w-4 h-4" />
                            <span>Adicionar widget</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Widget</DialogTitle>
                            <DialogDescription>
                                Escolha um widget para adicionar ao seu dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-colors">
                                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                                    <LayoutGrid className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Métricas de Vendas</h4>
                                    <p className="text-sm text-muted-foreground">Gráfico de área com KPI</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-colors">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <CalendarIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Calendário de Receita</h4>
                                    <p className="text-sm text-muted-foreground">Visão mensal de entradas</p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Notifications */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost" className="rounded-full w-10 h-10 bg-background border border-input shadow-sm hover:bg-accent relative">
                            <Bell className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium leading-none">Notificações</h4>
                                {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} novas</span>}
                            </div>
                            <div className="grid gap-4 max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(n => (
                                    <div key={n.id} className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${n.read ? 'opacity-50' : 'hover:bg-muted/50'}`}>
                                        <div className={`w-2 h-2 mt-2 rounded-full ${n.color}`} />
                                        <div>
                                            <p className="text-sm font-medium">{n.title}</p>
                                            <p className="text-xs text-muted-foreground">{n.desc}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-center text-muted-foreground py-4">Nenhuma notificação.</p>}

                                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={markAllAsRead} disabled={unreadCount === 0}>
                                    Marcar todas como lidas
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>


                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="w-10 h-10 border-2 border-background shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
                                <AvatarImage src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"} />
                                <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase() || "CN"}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || "Usuário"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => push('/perfil')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => push('/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configurações</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
