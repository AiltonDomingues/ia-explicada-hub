# Admin Panel - Complete Setup Guide

The admin panel has been created successfully! Here's everything you need to know.

## Features

-   Full CRUD (Create, Read, Update, Delete) operations for:
    -   Notícias (News)
    -   Artigos (Articles)
    -   Cursos (Courses)
    -   Materiais (Materials)
-   Protected routes with authentication
-   Clean dashboard interface
-   Form validation
-   Real-time updates with React Query

## Setup Instructions

### 1. Run Database Policies

Open your Supabase SQL Editor and run the policies in `ADMIN_SETUP.md` to enable authenticated users to modify content.

### 2. Create an Admin User

**Option A: Via Supabase Dashboard**

1.  Go to Authentication > Users
2.  Click "Add user"
3.  Enter email and password
4.  Save

**Option B: Enable Sign-Up**

1.  Go to Authentication > Providers
2.  Enable "Email" provider
3.  Users can register at `/admin/login`

### 3. Access the Admin Panel

1.  Start the dev server: `npm run dev`
2.  Navigate to `http://localhost:8080/admin/login`
3.  Enter your credentials
4.  You'll be redirected to the admin dashboard

## Admin Routes

-   `/admin/login` - Login page
-   `/admin` - Dashboard overview
-   `/admin/noticias` - Manage news
-   `/admin/artigos` - Manage articles
-   `/admin/cursos` - Manage courses
-   `/admin/materiais` - Manage materials

## Files Created

### Authentication

-   `src/hooks/useAuth.ts` - Authentication hook with sign in/out
-   `src/pages/AdminLogin.tsx` - Login page
-   `src/components/ProtectedRoute.tsx` - Route protection wrapper

### Admin Interface

-   `src/pages/AdminLayout.tsx` - Layout with sidebar and logout
-   `src/pages/AdminDashboard.tsx` - Dashboard home
-   `src/pages/AdminNoticias.tsx` - News management
-   `src/pages/AdminArtigos.tsx` - Articles management
-   `src/pages/AdminCursos.tsx` - Courses management
-   `src/pages/AdminMateriais.tsx` - Materials management

### Documentation

-   `ADMIN_SETUP.md` - Database policies and setup
-   `README_ADMIN.md` - This file

## How to Use

### Adding Content

1.  Navigate to any section (Notícias, Artigos, etc.)
2.  Click "Nova [Section]" button
3.  Fill in the form
4.  Click "Salvar"
5.  Content appears immediately on the public site

### Editing Content

1.  Find the item in the table
2.  Click the pencil icon
3.  Update the form
4.  Click "Salvar"

### Deleting Content

1.  Find the item in the table
2.  Click the trash icon
3.  Confirm deletion
4.  Content is removed immediately

## Data Structures

### Notícias (News)

-   Título (Title)
-   Resumo (Summary)
-   Data (Date)
-   Categoria (Category)
-   Imagem (Image URL)
-   Link (External link)

### Artigos (Articles)

-   Título (Title)
-   Autor (Author)
-   Resumo (Summary)
-   Data (Date)
-   Tags (comma-separated)
-   Link (External link)

### Cursos (Courses)

-   Título (Title)
-   Instrutor (Instructor)
-   Descrição (Description)
-   Nível (Level: Iniciante/Intermediário/Avançado)
-   Duração (Duration)
-   Preço (Price)
-   Imagem (Image URL)
-   Link (External link)

### Materiais (Materials)

-   Título (Title)
-   Tipo (Type: E-book/Guia/Podcast/Vídeo/Ferramenta)
-   Descrição (Description)
-   Autor (Author)
-   Link (External link)

## Security Notes

⚠️ Current setup allows ALL authenticated users to modify content.

For production, consider:

1.  Adding an `is_admin` claim to user metadata
2.  Creating admin roles in your database
3.  Restricting policies to specific user IDs or roles

## Troubleshooting

### Can't Log In

-   Verify user exists in Supabase Authentication
-   Check email/password are correct
-   Ensure Supabase URL and anon key are in `.env.local`

### Can't Save Content

-   Run the database policies from `ADMIN_SETUP.md`
-   Make sure you're logged in
-   Check browser console for errors

### Content Not Appearing

-   Refresh the page
-   Check that data was saved in Supabase Table Editor
-   Verify RLS policies are correctly set

## Next Steps

1.  Run the database policies
2.  Create your admin user
3.  Log in and start adding content!
4.  Content will appear immediately on your public site

The admin panel is fully integrated with your existing Supabase setup and React Query configuration.