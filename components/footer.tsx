import Link from "next/link";
import { Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-gray-400 py-8 text-center mt-auto w-full">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-2">
        <p className="text-sm font-display italic text-gray-300">
          <strong className="text-white not-italic">Chef:</strong>{" "}
          Isabella Bazeth
          <span className="mx-2 text-gray-600">·</span>
          <span className="text-gray-300">Natividade-RJ</span>
        </p>

        <div className="w-10 h-px bg-gray-700 my-1"></div>

        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <span>© Isa Sushi — Todos os direitos reservados</span>

          <Link
            href="/admin"
            prefetch={false}
            className="opacity-20 hover:opacity-100 hover:text-white transition-all p-1"
            title="Acesso Administrativo"
          >
            <Lock size={11} />
          </Link>
        </div>

        <small className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors mt-1">
          Desenvolvido por{" "}
          <a
            href="https://fescarvpage.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
          >
            Fernando Carvalho
          </a>
        </small>
      </div>
    </footer>
  );
}
