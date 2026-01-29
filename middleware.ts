// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Verifica se a rota acessada começa com /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    
    // Tenta ler o cabeçalho de autorização
    const authHeader = req.headers.get("authorization");

    // O Next.js já carrega isso automaticamente do .env.local
    const validUser = process.env.LOGIN;
    const validPass = process.env.SENHA; 

    // Verifica se as variáveis de ambiente foram carregadas
    if (!validUser || !validPass) {
        console.error("ERRO: Variáveis LOGIN e SENHA não definidas no .env.local");
        // Opcional: Bloquear tudo se não tiver senha configurada
    }

    if (authHeader) {
      // Decodifica o base64 (Formato: "Basic usuario:senha")
      const authValue = authHeader.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      // Compara
      if (user === validUser && pwd === validPass) {
        return NextResponse.next();
      }
    }

    // Se falhar, pede login
    return new NextResponse("Acesso Negado", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic realm='Painel Admin'" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};