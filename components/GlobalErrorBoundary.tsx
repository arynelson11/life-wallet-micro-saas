'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center text-white bg-black rounded-3xl border border-zinc-800 m-4">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado.</h2>
                    <p className="text-zinc-400 text-sm mb-6 max-w-sm">
                        Ocorreu um erro ao carregar este componente.
                    </p>
                    <div className="bg-zinc-900 p-4 rounded-lg text-left w-full mb-6 overflow-auto max-h-40">
                        <code className="text-xs text-red-400 font-mono">
                            {this.state.error?.message || "Erro desconhecido"}
                        </code>
                    </div>
                    <Button
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                        variant="default"
                        className="bg-primary text-black hover:bg-primary/90"
                    >
                        Tentar Novamente
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
