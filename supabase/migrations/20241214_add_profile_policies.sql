-- Enable RLS for profiles if not already enabled (it usually is)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy to allow users to insert their own profile (triggers usually handle this, but good to have)
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
