-- Permitir que un usuario autenticado lea su propio perfil
CREATE POLICY "Users to view their own data only" ON public.profiles AS PERMISSIVE FOR
SELECT
    TO authenticated USING (auth.uid () = user_id);