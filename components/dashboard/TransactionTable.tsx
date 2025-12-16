"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    Trash2,
    Edit2,
    ArrowUpCircle,
    ArrowDownCircle,
    Home,
    Utensils,
    Car,
    ShoppingBag,
    Heart,
    Briefcase,
    Zap,
    LayoutGrid,
    X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
    id: string;
    description: string;
    amount: number | string;
    type: 'income' | 'expense';
    category: string;
    date: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onDelete?: (id: string) => void;
    onEdit?: (transaction: Transaction) => void;
}

// Map categories to icons
const getCategoryIcon = (category: string) => {
    const normalized = category?.toLowerCase() || "";
    if (normalized.includes("casa") || normalized.includes("moradia")) return <Home className="w-4 h-4 text-blue-500" />;
    if (normalized.includes("aliment") || normalized.includes("comida")) return <Utensils className="w-4 h-4 text-orange-500" />;
    if (normalized.includes("transp") || normalized.includes("uber")) return <Car className="w-4 h-4 text-zinc-500" />;
    if (normalized.includes("compra")) return <ShoppingBag className="w-4 h-4 text-purple-500" />;
    if (normalized.includes("saude") || normalized.includes("médico")) return <Heart className="w-4 h-4 text-red-500" />;
    if (normalized.includes("trabalho") || normalized.includes("salario")) return <Briefcase className="w-4 h-4 text-green-600" />;
    if (normalized.includes("luz") || normalized.includes("internet")) return <Zap className="w-4 h-4 text-yellow-500" />;
    return <LayoutGrid className="w-4 h-4 text-zinc-400" />;
};

export function TransactionTable({ transactions, onDelete, onEdit }: TransactionTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Extract unique categories for filter
    const categories = useMemo(() => {
        const unique = new Set(transactions.map(t => t.category));
        return Array.from(unique).sort();
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === "all" || t.type === typeFilter;
            const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;

            return matchesSearch && matchesType && matchesCategory;
        });
    }, [transactions, searchTerm, typeFilter, categoryFilter]);

    // Grouping Logic
    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: Transaction[] } = {};

        filteredTransactions.forEach(t => {
            const date = parseISO(t.date);
            let key = format(date, "yyyy-MM-dd");
            if (isToday(date)) key = "Hoje";
            else if (isYesterday(date)) key = "Ontem";
            else key = format(date, "dd 'de' MMMM", { locale: ptBR });

            if (!groups[key]) groups[key] = [];
            groups[key].push(t);
        });

        // Sort keys? 'Today' first, then 'Yesterday', then dates desc...
        // Assuming transactions are already sorted by date desc from parent, 
        // the groups insertion order might be enough if we iterate keys correctly or just re-sort keys based on date logic if needed.
        // For simplicity, we trust the input order or simple key iteration if distinct.
        // But keys like "12 de Dezembro" don't sort textually well. 
        // Better: store as { label: string, date: Date, items: [] } and sort.

        // Re-approach:
        const groupsArr = [];
        const seenDates = new Set();

        // Iterate sorted transactions
        const sortedInput = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        let currentGroup: { label: string, items: Transaction[] } | null = null;
        let currentDateStr = "";

        sortedInput.forEach(t => {
            const d = parseISO(t.date);
            let label = format(d, "dd 'de' MMMM", { locale: ptBR });
            if (isToday(d)) label = "Hoje";
            if (isYesterday(d)) label = "Ontem";

            if (label !== currentDateStr) {
                if (currentGroup) groupsArr.push(currentGroup);
                currentGroup = { label, items: [] };
                currentDateStr = label;
            }
            currentGroup!.items.push(t);
        });
        if (currentGroup) groupsArr.push(currentGroup);

        return groupsArr;

    }, [filteredTransactions]);

    const hasFilters = searchTerm || typeFilter !== "all" || categoryFilter !== "all";
    const clearFilters = () => {
        setSearchTerm("");
        setTypeFilter("all");
        setCategoryFilter("all");
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Buscar transação..."
                        className="pl-10 bg-white border-zinc-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[130px] bg-white border-zinc-200">
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="income">Entradas</SelectItem>
                            <SelectItem value="expense">Saídas</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[150px] bg-white border-zinc-200">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {categories.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasFilters && (
                        <Button variant="ghost" size="icon" onClick={clearFilters} className="text-zinc-500 hover:text-red-500 hover:bg-red-50" title="Limpar Filtros">
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {filteredTransactions.length === 0 && (
                <div className="py-12 text-center text-zinc-400 flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 opacity-20" />
                    <p>Nenhuma transação encontrada.</p>
                </div>
            )}

            {/* Table Grouped */}
            <div className="space-y-8">
                {groupedTransactions.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pl-2">
                            {group.label}
                        </h4>

                        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                            <Table>
                                <TableBody>
                                    {group.items.map((t) => (
                                        <TableRow key={t.id} className="group hover:bg-zinc-50/50 border-b border-zinc-50 last:border-0">

                                            {/* Icon + Desc */}
                                            <TableCell className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:border-zinc-200 transition-colors">
                                                        {getCategoryIcon(t.category)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-zinc-900 leading-tight">{t.description}</p>
                                                        <div className="flex md:hidden text-xs text-zinc-400 mt-0.5 gap-2">
                                                            <span>{t.category}</span>
                                                            <span>•</span>
                                                            <span className={t.type === 'income' ? 'text-green-600' : 'text-red-500'}>
                                                                {t.type === 'income' ? '+' : '-'} {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Category (Desktop) */}
                                            <TableCell className="hidden md:table-cell text-zinc-500 text-sm">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-50 border border-zinc-100 text-xs font-medium">
                                                    {t.category}
                                                </span>
                                            </TableCell>

                                            {/* Value (Desktop) */}
                                            <TableCell className="hidden md:table-cell text-right">
                                                <span className={`font-mono font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="w-[50px]">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onEdit?.(t)}>
                                                            <Edit2 className="w-4 h-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete?.(t.id)}>
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
