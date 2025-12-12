"use client";

import { Search, Bell, Calendar as CalendarIcon, ChevronDown, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Header() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <header className="flex items-center justify-between mb-8 pt-4">
            {/* Title Section */}
            <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>Sales</span>
                    <span>/</span>
                    <span>Teach Products</span>
                </div>
                <h1 className="text-3xl font-bold text-black tracking-tight">
                    Product Sales Performance
                </h1>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-10 pl-10 pr-4 rounded-full bg-white border-none shadow-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                </div>

                {/* Date Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 rounded-full border-none shadow-sm bg-black text-white hover:bg-black/90 px-4 gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{date ? format(date, "dd MMM yyyy", { locale: ptBR }) : "Pick a date"}</span>
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
                <Button variant="outline" className="h-10 rounded-full border-none shadow-sm bg-white hover:bg-gray-50 gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add widget</span>
                </Button>

                {/* Notifications */}
                <Button size="icon" variant="ghost" className="rounded-full w-10 h-10 bg-white shadow-sm hover:bg-gray-50">
                    <Bell className="w-4 h-4" />
                </Button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
