# LifeWallet - Environment Variables Template

## Supabase Configuration

Get these credentials from: https://app.supabase.com/project/YOUR_PROJECT/settings/api

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Instructions

1. Create a `.env.local` file in the root directory
2. Copy the variables above and fill with your actual values
3. **NEVER commit `.env.local`** to git (it's in .gitignore)
4. Restart your Next.js dev server after changes

## App Configuration

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Optional: Feature Flags

```bash
NEXT_PUBLIC_ENABLE_WHATSAPP_INTEGRATION=false
NEXT_PUBLIC_ENABLE_GOOGLE_CALENDAR=false
```

## Security Notes

⚠️ **IMPORTANT**:
- The `NEXT_PUBLIC_` prefix makes variables accessible in client-side code
- `SUPABASE_SERVICE_ROLE_KEY` should ONLY be used in API routes (server-side)
- Never expose service role keys in client-side code
