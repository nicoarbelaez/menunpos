-- Politica para permitir el acceso de lectura a todos los usuarios
CREATE POLICY "Enable read access for tenant for all users" ON public.tenant AS PERMISSIVE FOR
SELECT
    TO public USING (true);

-- Politica para permitir el acceso de lectura a todos los usuarios
CREATE POLICY "Enable users to view their own data only" ON public.branch AS PERMISSIVE FOR
SELECT
    TO authenticated USING (
        tenant_id = (
            SELECT
                tenant_id
            FROM
                public.profiles
            WHERE
                user_id = auth.uid ()
        )
    );