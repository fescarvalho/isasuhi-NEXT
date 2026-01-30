import Link from "next/link";
import { Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-6 text-center border-t border-gray-900 mt-auto w-full">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-1 font-sans">
        <p className="text-sm sm:text-base">
          <strong className="text-white">Chef:</strong> Isabella Bazeth
          <span className="mx-2 text-gray-700">|</span>
          <span className="text-white/90">Natividade-RJ</span>
        </p>

        <div className="w-12 h-px bg-gray-800 my-2"></div>

        <div className="flex items-center justify-center gap-1 text-xs opacity-60">
          <span>© Isa Sushi - Todos os direitos reservados</span>

          {/* A CORREÇÃO ESTÁ AQUI: prefetch={false} */}
          <Link
            href="/admin"
            prefetch={false}
            className="opacity-20 hover:opacity-100 hover:text-white transition-all p-1"
            title="Acesso Administrativo"
          >
            <Lock size={12} />
          </Link>
        </div>

        <small className="text-[10px] opacity-40 hover:opacity-100 transition-opacity mt-1">
          Desenvolvido por{" "}
          <a
            href="https://www.linkedin.com/in/fecarvalhodev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white underline decoration-dotted underline-offset-2 transition-colors"
          >
            Fernando Carvalho
          </a>
        </small>
      </div>
    </footer>
  );
}
