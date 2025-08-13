import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const handlers = [
    updateSession, // lógica de sesión
  ];

  for (const handler of handlers) {
    const result = await handler(request);
    if (result) {
      return result; // si devuelve algo (redirect/response), se detiene aquí
    }
  }
  return NextResponse.next(); // si ninguno respondió, continua normalmente
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
