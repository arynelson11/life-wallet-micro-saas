# How to Use the Seed Script

## What It Does

The `seed.sql` script populates your database with sample data:

**5 Transactions:**
- 🚗 Uber: -R$ 35,50 (Transporte)
- 🛒 Supermercado: -R$ 287,90 (Alimentação)
- 💰 Salário: +R$ 5.500,00 (Income)
- 📺 Netflix: -R$ 39,90 (Entretenimento)
- 🍽️ Restaurante: -R$ 125,00 (Alimentação)

**2 Goals:**
- 🛡️ Reserva de Emergência: R$ 12.000 / R$ 15.000 (80% complete)
- ✈️ Viagem para Paris: R$ 5.000 / R$ 25.000 (20% complete)

## How to Run

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the entire contents of `seed.sql`
5. Click **Run**

**Important**: Make sure you're logged in as a user before running this script, as it uses `auth.uid()` to get your user ID.

### Option 2: From Your App

If you have authentication set up in your app:
1. Log in to your app
2. Open Supabase dashboard
3. Run the seed script while authenticated

## Verification

After running the seed script, check:

1. **Transactions Table**: Should have 5 new rows
   ```sql
   SELECT * FROM transactions ORDER BY date DESC LIMIT 5;
   ```

2. **Goals Table**: Should have 2 new rows
   ```sql
   SELECT * FROM goals;
   ```

3. **Your Dashboard**: Visit `/dashboard` to see the transactions
4. **Goals Page**: Visit `/metas` to see the goals with progress bars

## Troubleshooting

**Error: "auth.uid() is not defined"**
- Make sure you're running this query while authenticated in Supabase
- Alternatively, you can manually replace `auth.uid()` with your actual user UUID

**Error: "Foreign key violation"**
- Make sure you've run the initial migration (`20241128_initial_schema.sql`) first
- Make sure your user has a profile and personal space created

## Re-running the Script

You can run this script multiple times - it will create duplicate entries. If you want to clear the data first:

```sql
-- Clear all data (be careful!)
DELETE FROM transactions;
DELETE FROM goals;
```

---

**Ready to test?** Run the seed script and refresh your app! 🚀
