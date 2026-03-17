# Database Migration: Add Artigos Columns

## What This Migration Does

Adds missing columns to the `artigos` table to match the structure used by the automated article fetcher and the hardcoded data format.

## Columns Added

| Column | Type | Description |
|--------|------|-------------|
| `categoria` | TEXT | Article category (Tutorial, Machine Learning, NLP, etc.) |
| `tempo_leitura` | TEXT | Reading time estimate (e.g., "5 min") |
| `destaque` | BOOLEAN | Whether article is featured (default: false) |
| `descricao` | TEXT | Full description (copies from `resumo` for existing records) |

## How to Run

### Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/tdxxvweafelvgxoujpml/editor)
2. Click **"New query"**
3. Copy and paste the contents of `migrations/add_artigos_columns.sql`
4. Click **"Run"** or press `Ctrl+Enter`
5. Verify success message in the output

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push

# Or run the migration directly
supabase db execute -f migrations/add_artigos_columns.sql
```

## Verification

After running the migration, verify the columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'artigos'
ORDER BY ordinal_position;
```

Expected columns:
- id
- titulo
- autor
- resumo
- data
- tags
- link
- created_at
- **categoria** ← New
- **tempo_leitura** ← New
- **destaque** ← New
- **descricao** ← New

## Impact

### Before Migration
- Articles fetcher would fail with error: "Could not find the 'categoria' column"
- Admin panel couldn't set categories or reading time
- Frontend showed default values for all articles

### After Migration
- ✅ Articles fetcher can import with proper categories
- ✅ Admin panel allows manual category/reading time entry
- ✅ Articles display correct category and reading time
- ✅ Featured articles can be flagged

## Files Updated

After running this migration, these files work correctly:

- `scripts/fetch-articles.js` - Now writes categoria and tempo_leitura
- `src/pages/AdminArtigos.tsx` - Form includes all fields
- `src/lib/supabase.ts` - Types match database schema
- `src/hooks/useSupabase.ts` - Data mapping handles all fields

## Rollback

If you need to rollback this migration:

```sql
ALTER TABLE artigos DROP COLUMN IF EXISTS categoria;
ALTER TABLE artigos DROP COLUMN IF EXISTS tempo_leitura;
ALTER TABLE artigos DROP COLUMN IF EXISTS destaque;
ALTER TABLE artigos DROP COLUMN IF EXISTS descricao;
```

⚠️ **Warning**: This will permanently delete data in these columns!

## Next Steps

1. Run the migration
2. Test the articles fetcher: Go to GitHub Actions → "Fetch AI Articles Weekly" → Run workflow
3. Test the admin panel: Add a new article manually
4. Verify articles display correctly on the frontend
