# Admin Panel Database Policies

Run these SQL commands in your Supabase SQL Editor to enable admin users to create, update, and delete content:

```sql
-- Enable authenticated users to INSERT, UPDATE, and DELETE noticias
CREATE POLICY "Authenticated users can insert noticias"
ON public.noticias
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update noticias"
ON public.noticias
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete noticias"
ON public.noticias
FOR DELETE
TO authenticated
USING (true);

-- Enable authenticated users to INSERT, UPDATE, and DELETE artigos
CREATE POLICY "Authenticated users can insert artigos"
ON public.artigos
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update artigos"
ON public.artigos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete artigos"
ON public.artigos
FOR DELETE
TO authenticated
USING (true);

-- Enable authenticated users to INSERT, UPDATE, and DELETE cursos
CREATE POLICY "Authenticated users can insert cursos"
ON public.cursos
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update cursos"
ON public.cursos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cursos"
ON public.cursos
FOR DELETE
TO authenticated
USING (true);

-- Enable authenticated users to INSERT, UPDATE, and DELETE materiais
CREATE POLICY "Authenticated users can insert materiais"
ON public.materiais
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update materiais"
ON public.materiais
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete materiais"
ON public.materiais
FOR DELETE
TO authenticated
USING (true);
```

## Creating an Admin User

To create an admin user in Supabase:

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Invite user" or "Add user"
3. Enter the admin email and password
4. The user will be able to log in at `/admin/login`

Alternatively, you can enable "Email" sign-up in Authentication > Providers and allow users to register directly.

## Testing the Admin Panel

1. Navigate to `http://localhost:8080/admin/login`
2. Enter your admin credentials
3. You'll be redirected to `/admin` with the dashboard
4. Use the sidebar to manage content in all sections

## Security Note

These policies allow ALL authenticated users to modify content. For production, consider:

- Creating a custom `is_admin` claim in the user metadata
- Adding a check like `auth.jwt() ->> 'is_admin' = 'true'` to the policies
- Or creating an admin role in your database and checking against it
