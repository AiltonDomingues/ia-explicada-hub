# Supabase Database Setup Guide

## Step 1: Create Tables

Go to your Supabase dashboard → SQL Editor and run these commands:

### 1. Notícias Table
```sql
CREATE TABLE noticias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data DATE NOT NULL,
  categoria TEXT NOT NULL,
  link TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  tempo_leitura TEXT DEFAULT '5 min',
  trending BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON noticias
  FOR SELECT TO public USING (true);
```

### 2. Artigos Table
```sql
CREATE TABLE artigos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  resumo TEXT NOT NULL,
  data DATE NOT NULL,
  tags TEXT[] NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE artigos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON artigos
  FOR SELECT TO public USING (true);
```

### 3. Cursos Table
```sql
CREATE TABLE cursos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  instrutor TEXT NOT NULL,
  descricao TEXT NOT NULL,
  nivel TEXT NOT NULL,
  duracao TEXT NOT NULL,
  preco TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON cursos
  FOR SELECT TO public USING (true);
```

### 4. Materiais Table
```sql
CREATE TABLE materiais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  autor TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE materiais ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON materiais
  FOR SELECT TO public USING (true);
```

## Step 2: Insert Sample Data

You can migrate your existing hardcoded data by running:

### Insert Notícias
```sql
INSERT INTO noticias (titulo, resumo, data, categoria, imagem, link) VALUES
('Your title', 'Your summary', '2024-01-01', 'Technology', '/image.jpg', 'https://link.com');
```

Repeat for artigos, cursos, and materiais with your existing data.

## Step 3: Enable Storage (Optional - for images)

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `images`
3. Make it public
4. Upload your images there

## Step 4: Create Admin Policies (for content management)

```sql
-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" ON noticias
  FOR INSERT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update" ON noticias
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete" ON noticias
  FOR DELETE TO authenticated USING (true);
```

Repeat for all tables (artigos, cursos, materiais).

## Step 5: Get Your Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: Paste in `.env.local` as `VITE_SUPABASE_URL`
   - **Anon/Public Key**: Paste in `.env.local` as `VITE_SUPABASE_ANON_KEY`

## Done!

After completing these steps, restart your dev server and your app will fetch data from Supabase.
