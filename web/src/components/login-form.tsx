"use client";

import { cn, getBaseUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log({ email, password });
  };

  const signInWithGoogle = async () => {
    const next = searchParams.get("next");
    const redirectTo = `${getBaseUrl()}/auth/callback?next=${next}`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Título y descripción */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tu correo electrónico abajo para iniciar sesión en tu cuenta
        </p>
      </div>

      {/* Botones de login social */}
      <div className="grid gap-4">
        <Button
          variant="secondary"
          onClick={signInWithGoogle}
          className="dark w-full cursor-pointer text-white"
        >
          <IconBrandGoogleFilled className="mr-2" />
          Iniciar sesión con Google
        </Button>
      </div>

      {/* Separador visual */}
      <div className="relative text-center text-sm">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          O continúa con
        </span>
        <div className="border-border absolute inset-0 top-1/2 border-t"></div>
      </div>

      {/* Formulario tradicional */}
      <form onSubmit={handleSubmit} className="grid gap-6" {...props}>
        <div className="grid gap-3">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@ejemplo.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Iniciar sesión
        </Button>
      </form>

      {/* Enlace de registro */}
      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <a href="#" className="underline underline-offset-4">
          Regístrate
        </a>
      </div>
    </div>
  );
}
