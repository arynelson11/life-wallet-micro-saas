"use server";

import { createClient } from "@/lib/supabase/server";

export async function runDatabaseRepair() {
    const supabase = await createClient();

    const sqlCommands = [
        // 1. Transactions Column Fix
        `DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'profile_id') THEN 
                ALTER TABLE public.transactions ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE; 
                CREATE INDEX IF NOT EXISTS idx_transactions_profile_id ON public.transactions(profile_id);
            END IF; 
        END $$;`,

        // 2. Debts Table
        `CREATE TABLE IF NOT EXISTS public.debts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            total_amount NUMERIC(12, 2) NOT NULL,
            paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
            category TEXT,
            due_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,

        // 3. Credit Cards Table
        `CREATE TABLE IF NOT EXISTS public.credit_cards (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            limit_amount NUMERIC(12, 2) NOT NULL,
            closing_day INTEGER NOT NULL CHECK (closing_day BETWEEN 1 AND 31),
            due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
            color TEXT NOT NULL DEFAULT '#000000',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,

        // 4. Appointments Table
        `CREATE TABLE IF NOT EXISTS public.appointments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            amount NUMERIC(12, 2) NOT NULL,
            category TEXT NOT NULL,
            date TIMESTAMP WITH TIME ZONE NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('bill', 'income')),
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,

        // 5. Goals Table (just in case)
        `CREATE TABLE IF NOT EXISTS public.goals (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
          target_amount NUMERIC(12, 2) NOT NULL,
          icon TEXT,
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`
    ];

    const results = [];

    // Note: Supabase JS client doesn't expose raw query easily without 'rpc' or custom function.
    // However, if the user has a "exec_sql" function set up, we use it. 
    // If NOT, we can't run DDL (CREATE TABLE) from client easily unless we rely on the migration file being applied via CLI.
    // BUT, the user's error suggests they are running locally OR connected to a remote DB where migration failed.

    // ALTERNATIVE: We use `supabase.rpc` if a function exists. If not, this action might fail if we can't execute SQL.
    // LUCKILY, we can try to use standard querying for data, but for Schema changes, we usually need the CLI.

    // CRITICAL STRATEGY CHANGE: 
    // Since we cannot run raw SQL via 'supabase-js' client without a pre-existing RPC function, 
    // and the user is getting schema errors, it implies the CLI migration didn't run.
    // I will try to use the `postgres` library if available, OR assume the user can run a command.
    // BUT, I can see `package.json` has `pg` or I can check. No, it uses `@supabase/supabase-js`.

    // FALLBACK: I will create an SQL file and try to run it via `npx supabase db reset` or similar if I can, TO THE LOCAL TERMINAL.
    // The user has a terminal. I can propose a command.

    return { success: false, message: "Use the terminal command provided to fix the database." };
}
