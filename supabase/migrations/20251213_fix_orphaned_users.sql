-- Find users who do not own any space and create a default 'PERSONAL' space for them

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT id FROM auth.users
        WHERE id NOT IN (SELECT owner_id FROM public.spaces)
    LOOP
        INSERT INTO public.spaces (id, name, type, owner_id)
        VALUES (uuid_generate_v4(), 'Minha Carteira', 'PERSONAL', r.id);
        
        RAISE NOTICE 'Created default space for user %', r.id;
    END LOOP;
END $$;
