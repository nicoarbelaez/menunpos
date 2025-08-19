import { NextResponse, type NextRequest } from "next/server";
import { UrlPrefix } from "@/constans/url-prefix";
import { AccountType } from "@/types/profiles";

// Función para aplicar el prefijo solo si es necesario
export const changePrefix = (url: URL, prefix: UrlPrefix): URL => {
  const segments = url.pathname.split("/").filter(Boolean);
  const current = segments[0] as UrlPrefix | undefined;

  if (current === prefix) {
    return url; // Ya tiene el prefijo
  }

  // Remueve posible prefijo anterior
  if (current === UrlPrefix.CLIENT || current === UrlPrefix.BUSINESS) {
    segments.shift();
  }

  // Añade el nuevo prefijo
  return new URL(`/${prefix}/${segments.join("/")}`, url);
};

export async function subdomainRedirect(request: NextRequest) {
  const nextUrl = request.nextUrl;
  if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  const url = nextUrl.clone();  
  const host = request.headers.get("host") || "";
  const subdomain = host.split(".")[0];
  const acctCookie = request.cookies.get("account_type")?.value as
    | AccountType
    | undefined;

  let targetPrefix: UrlPrefix | null = null;

  if (
    subdomain === "app" &&
    (acctCookie === AccountType.CLIENT || acctCookie === AccountType.BOTH)
  ) {
    targetPrefix = UrlPrefix.CLIENT;
  } else if (
    acctCookie === AccountType.BUSINESS ||
    acctCookie === AccountType.BOTH
  ) {
    targetPrefix = UrlPrefix.BUSINESS;
  }

  if (!targetPrefix) {
    return;
  }

  const newUrl = changePrefix(url, targetPrefix);

  if (newUrl.href !== url.href) {
    return NextResponse.redirect(newUrl);
  }

  return;
}
