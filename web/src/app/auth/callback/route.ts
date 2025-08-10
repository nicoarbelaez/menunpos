import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // si "next" está en los parámetros, úsalo como la URL de redirección
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // si "next" no es una URL relativa, usa la predeterminada
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // devuelve al usuario a una página de error con instrucciones
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
