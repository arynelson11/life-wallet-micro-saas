-- Create Investments Table
CREATE TABLE IF NOT EXISTS public.investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(15,2) DEFAULT 0 NOT NULL
);

-- Enable RLS
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Policies (Assuming standard public.spaces member check)
CREATE POLICY "Users can view investments in their spaces" ON public.investments
    FOR SELECT USING (
        exists (
            select 1 from public.space_members
            where space_members.space_id = investments.space_id
            and space_members.user_id = auth.uid()
        )
        OR
        exists (
            select 1 from public.spaces
            where spaces.id = investments.space_id
            and spaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert investments in their spaces" ON public.investments
    FOR INSERT WITH CHECK (
        exists (
            select 1 from public.space_members
            where space_members.space_id = investments.space_id
            and space_members.user_id = auth.uid()
        )
        OR
        exists (
            select 1 from public.spaces
            where spaces.id = investments.space_id
            and spaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete investments in their spaces" ON public.investments
    FOR DELETE USING (
        exists (
            select 1 from public.space_members
            where space_members.space_id = investments.space_id
            and space_members.user_id = auth.uid()
        )
        OR
        exists (
            select 1 from public.spaces
            where spaces.id = investments.space_id
            and spaces.owner_id = auth.uid()
        )
    );
