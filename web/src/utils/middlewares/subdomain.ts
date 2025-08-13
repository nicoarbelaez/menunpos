import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function subdomainRedirect(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const subdomain = host.split(".")[0]; // Obtiene el subdominio antes del primer punto

  const supabase = createClient();
  const { data } = await supabase
    .from("tenant")
    .select("tenant_id")
    .eq("slug", subdomain)
    .single();

  if (!data) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // Verifica si la ruta ya tiene el prefijo adecuado
  if (subdomain === "app" && !url.pathname.startsWith("/c")) {
    url.pathname = url.pathname === "/" ? "/c" : `/c${url.pathname}`;
    return NextResponse.redirect(url);
  }

  if (subdomain !== "app" && !url.pathname.startsWith("/t")) {
    url.pathname = url.pathname === "/" ? "/t" : `/t${url.pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
