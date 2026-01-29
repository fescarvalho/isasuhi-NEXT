import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Verifica se a rota acessada começa com /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    
    // Tenta ler o cabeçalho de autorização (usuário/senha digitados)
    const authHeader = req.headers.get("authorization");

    // SEU LOGIN E SENHA AQUI
    const validUser = "isabella";
    const validPass = "isasuhsi"; 

    if (authHeader) {
      // Decodifica o que o navegador mandou
      const authValue = authHeader.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      // Se bater com o login correto, deixa passar
      if (user === validUser && pwd === validPass) {
        return NextResponse.next();
      }
    }

    // Se não tiver logado ou errou a senha, bloqueia e pede de novo
    return new NextResponse("Acesso Negado", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic realm='Painel Admin'" },
    });
  }

  return NextResponse.next();
}

// Configuração: Diz ao Next.js para rodar esse arquivo apenas nas rotas /admin
export const config = {
  matcher: "/admin/:path*",
};