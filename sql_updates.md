# SQL Updates para Supabase

## Atualizar tabela `cursos`

Execute este SQL no Supabase SQL Editor (https://supabase.com/dashboard/project/tdxxvweafelvgxoujpml/editor):

```sql
-- Add missing columns to cursos table
ALTER TABLE cursos 
ADD COLUMN IF NOT EXISTS plataforma TEXT;

ALTER TABLE cursos 
ADD COLUMN IF NOT EXISTS nota TEXT;

ALTER TABLE cursos 
ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT false;

-- Update existing records with default values
UPDATE cursos 
SET plataforma = 'Online' 
WHERE plataforma IS NULL;

UPDATE cursos 
SET nota = '0' 
WHERE nota IS NULL;

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cursos'
ORDER BY ordinal_position;
```

## Atualizar tabela `artigos`

Execute este SQL no Supabase SQL Editor:

```sql
-- Make resumo nullable
ALTER TABLE artigos 
ALTER COLUMN resumo DROP NOT NULL;

-- Add missing columns
ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS categoria TEXT;

ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS tempo_leitura TEXT;

ALTER TABLE artigos 
ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT false;

-- Remove descricao if exists (redundant with resumo)
ALTER TABLE artigos 
DROP COLUMN IF EXISTS descricao;

-- Set defaults for existing records
UPDATE artigos 
SET categoria = 'Inteligência Artificial' 
WHERE categoria IS NULL;

UPDATE artigos 
SET tempo_leitura = '5 min' 
WHERE tempo_leitura IS NULL;

UPDATE artigos 
SET resumo = 'Artigo sobre inteligência artificial'
WHERE resumo IS NULL OR resumo = '';

-- Verify columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'artigos'
ORDER BY ordinal_position;
```

## Remover colunas desnecessárias de `cursos`

Caso você queira limpar a tabela e remover o campo `estudantes` e `avaliacoes` se existir:

```sql
-- Remove estudantes column if exists
ALTER TABLE cursos 
DROP COLUMN IF EXISTS estudantes;

-- Remove avaliacoes column if exists
ALTER TABLE cursos 
DROP COLUMN IF EXISTS avaliacoes;
```

## Notas

- `instrutor` na tabela é mapeado para `autor` no código (useSupabase.ts já faz isso)
- Execute os comandos na ordem apresentada
- Verifique os resultados com os comandos SELECT ao final de cada seção
