import Link from "next/link";

export default function Footer() {
	return (
		<footer className="text-center py-4 text-gray-600 dark:text-gray-400 bg-background-light dark:bg-background-dark">
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
