-- Add invite_code to spaces
ALTER TABLE public.spaces ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE DEFAULT substring(md5(random()::text) from 0 for 7);

-- Function to join a space by code
CREATE OR REPLACE FUNCTION public.join_space_by_code(code_input TEXT, user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  target_space_id UUID;
  is_already_member BOOLEAN;
BEGIN
  -- Find space by code
  SELECT id INTO target_space_id
  FROM public.spaces
  WHERE invite_code = code_input;

  IF target_space_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Código inválido');
  END IF;

  -- Check if already member
  SELECT EXISTS (
    SELECT 1 FROM public.space_members
    WHERE space_id = target_space_id AND user_id = user_uuid
  ) INTO is_already_member;

  IF is_already_member THEN
    RETURN jsonb_build_object('success', false, 'message', 'Você já é membro deste espaço');
  END IF;

  -- Add member
  INSERT INTO public.space_members (space_id, user_id, role)
  VALUES (target_space_id, user_uuid, 'member');

  RETURN jsonb_build_object('success', true, 'space_id', target_space_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
