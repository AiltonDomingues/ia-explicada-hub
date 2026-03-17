# 🚀 Supabase Integration - Complete Setup Guide

## ✅ What's Been Done

I've set up everything for Supabase integration:

1. ✅ Installed `@supabase/supabase-js` package
2. ✅ Created Supabase client configuration (`src/lib/supabase.ts`)
3. ✅ Created custom React hooks for data fetching (`src/hooks/useSupabase.ts`)
4. ✅ Updated Index page to use Supabase with fallback to hardcoded data
5. ✅ Created environment file templates (`.env.local` and `.env.example`)
6. ✅ Created database setup guide (`SUPABASE_SETUP.md`)

## 📋 What You Need to Do

### Step 1: Configure Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to: **Project Settings** → **API**
3. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public key** (starts with `eyJ...`)

4. Open the file `.env.local` in your project root
5. Replace the placeholders:
   ```env
   VITE_SUPABASE_URL=https://your-actual-url.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJyour-actual-key-here...
   ```

### Step 2: Create Database Tables

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL from `SUPABASE_SETUP.md` (one table at a time)
5. Click **Run** for each table creation script

**Tables to create:**
- `noticias` (News)
- `artigos` (Articles)
- `cursos` (Courses)
- `materiais` (Materials)

### Step 3: Migrate Your Existing Data

Your app currently has hardcoded data in:
- `src/data/noticias.ts`
- `src/data/artigos.ts`
- `src/data/cursos.ts`
- `src/data/materiais.ts`

**Option A: Manual Entry (Recommended for now)**
1. Go to Supabase dashboard → **Table Editor**
2. Select each table
3. Click **Insert** → **Insert row**
4. Add your content manually

**Option B: SQL Insert (Faster)**
Use the SQL Editor to insert multiple rows at once. Example:
```sql
INSERT INTO noticias (titulo, resumo, data, categoria, imagem, link) VALUES
('First news title', 'Summary here', '2024-01-15', 'Technology', '/img1.jpg', 'https://link1.com'),
('Second news title', 'Summary here', '2024-01-14', 'AI', '/img2.jpg', 'https://link2.com');
```

### Step 4: Restart Your Dev Server

```powershell
# Stop the current server (Ctrl+C in terminal)
# Then start it again:
npm run dev
```

### Step 5: Test the Integration

1. Open your app in the browser
2. Check browser console (F12) for any errors
3. The app should now fetch data from Supabase!
4. If Supabase isn't configured yet, it automatically falls back to hardcoded data

## 🎯 How It Works

- **With Supabase configured**: App fetches live data from your database
- **Without Supabase**: App uses hardcoded data (so nothing breaks during setup)

## 🔐 Security Note

- ✅ `.env.local` is already in `.gitignore` (won't be committed to Git)
- ✅ The anon key is safe to use in your frontend (it's public)
- ✅ Row Level Security (RLS) is enabled to protect your data

## 🎨 Next Steps (Future Features)

Once this is working, you can add:
- **Admin panel** for adding/editing content through a UI
- **Image uploads** using Supabase Storage
- **Authentication** for content management
- **Real-time updates** when content changes

## ❓ Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure `.env.local` has the correct values
- Restart your dev server after adding environment variables

### Data not showing
- Check browser console for errors
- Verify tables exist in Supabase dashboard
- Verify tables have data (Table Editor → select table)
- Check that RLS policies are set correctly

### Import errors
- Make sure `@supabase/supabase-js` is installed
- Try running: `npm install --legacy-peer-deps`

---

**Need help?** Check `SUPABASE_SETUP.md` for detailed SQL commands.
