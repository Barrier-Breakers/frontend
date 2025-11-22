import Link from "next/link";

export default function Footer() {
	return (
		<footer className="fixed bottom-0 left-0 right-0 text-center py-4 text-gray-600 dark:text-gray-400 z-10 bg-background-light dark:bg-background-dark">
			<Link href="/politica-privacidade" className="hover:underline mx-2">
				Política de Privacidade
			</Link>
			|
			<Link href="/termos-condicoes" className="hover:underline mx-2">
				Termos e Condições
			</Link>
		</footer>
	);
}
