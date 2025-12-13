"use client";

import { Search, Bell, Calendar as CalendarIcon, Plus, LayoutGrid } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isWidgetOpen, setIsWidgetOpen] = useState(false);

    return (
        <header className="flex items-center justify-between mb-8 pt-4">
            {/* Title Section */}
            <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>Vendas</span>
                    <span>/</span>
                    <span>Produtos Digitais</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    Performance de Vendas
                </h1>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="h-10 pl-10 pr-4 rounded-full bg-background border border-input shadow-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                </div>

                {/* Date Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 rounded-full border-input shadow-sm bg-background text-foreground hover:bg-accent px-4 gap-2">
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
                        <Button variant="outline" className="h-10 rounded-full border-input shadow-sm bg-background hover:bg-accent gap-2">
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
                <Button size="icon" variant="ghost" className="rounded-full w-10 h-10 bg-background border border-input shadow-sm hover:bg-accent">
                    <Bell className="w-4 h-4" />
                </Button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <ModeToggle />
                    <Avatar className="w-10 h-10 border-2 border-background shadow-sm cursor-pointer">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
