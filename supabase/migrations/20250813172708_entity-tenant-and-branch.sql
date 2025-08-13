-- 1. Función disparadora para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.insert_user_in_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Inserta un perfil básico para el nuevo usuario
  INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger en auth.users que ejecuta la función después de cada inserción
CREATE TRIGGER on_auth_insert_users
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.insert_user_in_profile_for_new_user();


-- 2. Tablas principales: tenant y branch

-- Tabla tenant: almacena datos de arrendadores o entidades similares
CREATE TABLE IF NOT EXISTS public.tenant (
  tenant_id INT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  user_admin_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  demo_expiration_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla branch: sucursales asociadas a un tenant específico
CREATE TABLE IF NOT EXISTS public.branch (
  branch_id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES public.tenant (tenant_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 3. Trigger para crear automáticamente la primera sucursal
CREATE OR REPLACE FUNCTION public.insert_the_first_branch_of_the_tenant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Inserta la sucursal principal usando el nombre del tenant
  INSERT INTO public.branch (tenant_id, name)
    VALUES (NEW.tenant_id, NEW.name);
  RETURN NEW;
END;
$$;

-- Asociamos el trigger a la tabla tenant
CREATE TRIGGER on_insert_tenant
AFTER INSERT ON public.tenant
FOR EACH ROW
EXECUTE FUNCTION public.insert_the_first_branch_of_the_tenant();
