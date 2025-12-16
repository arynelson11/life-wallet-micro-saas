import { UserProfileProvider } from "@/context/UserProfileContext";

// ... keep existing imports ...

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // ... keep existing server logic ...

    return (
        <UserProfileProvider>
            <Sidebar />

            {/* Conteúdo Principal */}
            <main className="min-h-screen transition-all duration-300 pb-24 md:pb-4 md:pl-28 px-5 py-6 md:pr-8">
                <SubscriptionGuard>
                    {children}
                </SubscriptionGuard>
            </main>

            {/* Menu Inferior (Apenas Mobile) */}
            <MobileNav spaceId={spaceId} />
        </UserProfileProvider>
    );
}
