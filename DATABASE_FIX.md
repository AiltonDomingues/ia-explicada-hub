# Database Schema Update

The admin forms are working, but the data isn't appearing on the site because the database schema is missing some fields that the components expect.

## Run this SQL in Supabase SQL Editor:

```sql
-- Update noticias table to match component expectations
-- Rename resumo to descricao (if exists)
ALTER TABLE noticias RENAME COLUMN resumo TO descricao;

-- Add missing fields
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS tempo_leitura TEXT DEFAULT '5 min';
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false;

-- Remove imagem column (not needed)
ALTER TABLE noticias DROP COLUMN IF EXISTS imagem;
ALTER TABLE cursos DROP COLUMN IF EXISTS imagem;

-- Update existing data to have default values
UPDATE noticias SET tags = '{}' WHERE tags IS NULL;
UPDATE noticias SET tempo_leitura = '5 min' WHERE tempo_leitura IS NULL;
UPDATE noticias SET trending = false WHERE trending IS NULL;
```

After running this SQL, refresh your site and the news you added should appear!
