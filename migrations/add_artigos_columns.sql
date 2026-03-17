-- Add missing columns to artigos table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/tdxxvweafelvgxoujpml/editor

-- Add categoria column
ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS categoria TEXT;

-- Add tempo_leitura column
ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS tempo_leitura TEXT;

-- Add destaque column for featured articles
ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT false;

-- Optional: Add description column to match hardcoded data structure
ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS descricao TEXT;

-- Update existing records with default values
UPDATE artigos 
SET categoria = 'Inteligência Artificial' 
WHERE categoria IS NULL;

UPDATE artigos 
SET tempo_leitura = '5 min' 
WHERE tempo_leitura IS NULL;

UPDATE artigos 
SET descricao = resumo 
WHERE descricao IS NULL;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'artigos'
ORDER BY ordinal_position;
