"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface ResponsiveDialogProps {
    children: React.ReactNode;
    trigger: React.ReactNode;
    title: string;
    description?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ResponsiveDialog({
    children,
    trigger,
    title,
    description,
    open,
    onOpenChange,
}: ResponsiveDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Enquanto não sabe o tamanho da tela, não renderiza nada para evitar hydration error
    if (isDesktop === undefined) {
        return null;
    }

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white border-zinc-100 shadow-apple-lg rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-zinc-900">{title}</DialogTitle>
                        {description && (
                            <DialogDescription className="text-zinc-500 font-medium">
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    <div className="mt-4">{children}</div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent className="bg-zinc-50 border-t border-zinc-100 rounded-t-[2rem]">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mt-4 mb-4" />
                <DrawerHeader className="text-left">
                    <DrawerTitle className="text-2xl font-bold text-zinc-900">{title}</DrawerTitle>
                    {description && (
                        <DrawerDescription className="text-zinc-500 font-medium">
                            {description}
                        </DrawerDescription>
                    )}
                </DrawerHeader>
                <div className="p-4 pb-8">{children}</div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full rounded-full h-12 font-semibold text-zinc-900 border-zinc-200 bg-white">
                            Cancelar
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
