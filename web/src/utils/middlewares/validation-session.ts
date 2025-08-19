import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { AccountType } from "@/types/profiles";

interface RedirectToLoginParams {
  request: NextRequest;
  error?: string;
}

export const redirectToLogin = ({ request, error }: RedirectToLoginParams) => {
  const nextUrl = request.nextUrl;

  if (nextUrl.pathname.startsWith("/login")) {
    return;
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", nextUrl.pathname + nextUrl.search);

  if (error) {
    loginUrl.searchParams.set("error", error);
  }

  return NextResponse.redirect(loginUrl);
};

export async function validationSession(request: NextRequest) {
  const nextUrl = request.nextUrl;
  if (
    nextUrl.pathname.startsWith("/auth") ||
    nextUrl.searchParams.get("error")
  ) {
    return;
  }

  const host = request.headers.get("host") || "";
  const subdomain = host.split(".")[0]; // el primer segmento

  // Si no es el subdominio "app", validar tenant
  if (subdomain !== "app") {
    const supabaseForTenant = await createClient();
    const { data: tenant } = await supabaseForTenant
      .from("tenant")
      .select("tenant_id")
      .eq("slug", subdomain)
      .single();

    if (!tenant) {
      // no existe tenant -> 404
      return NextResponse.rewrite(new URL("/404", request.url));
    }
    // si existe el tenant: seguimos
  }

  // Ahora validamos autenticación (tanto para app como para tenant-hosts)
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // No autenticado -> enviar a login con next para volver luego
    return redirectToLogin({ request });
  }

  if (user && nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Obtener account_type
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    return redirectToLogin({ request, error: "profile_not_found" });
  }

  // Determinar allowed según subdominio:
  // - si subdomain === 'app' => debe ser client o both
  // - si subdomain !== 'app' => (empresa) debe ser business o both
  const acct = profile.account_type as AccountType;
  const isApp = subdomain === "app";

  if (acct === AccountType.BOTH) {
    return;
  }

  if (isApp && acct === AccountType.CLIENT) {
    return;
  }

  if (acct === AccountType.BUSINESS) {
    return;
  }

  return redirectToLogin({ request, error: "wrong_account_type" });
}
