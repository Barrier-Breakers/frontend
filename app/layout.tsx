import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import BackgroundDecorations from "../components/BackgroundDecorations";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-poppins",
});

export const metadata: Metadata = {
	title: "Legislaí - Sua voz na legislação local",
	description:
		"Legislaí é uma plataforma participativa onde você pode contribuir para a sociedade a partir da sua região. Crie denúncias sobre problemas locais que serão encaminhadas aos órgãos responsáveis, aprenda sobre legislação, e dê seu palpite sobre proposições que estão sendo votadas. Sua voz tem peso nas decisões que afetam sua comunidade.",
	keywords: ["legislação", "participação", "democracia", "denúncias", "comunidade", "voto"],
	authors: [{ name: "Barrier Breakers" }],
	openGraph: {
		title: "Legislaí - Sua voz na legislação local",
		description:
			"Plataforma de participação cívica para contribuir com sua comunidade através de denúncias, educação em legislação e votação em proposições.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className="scroll-smooth">
			<body
				className={`${poppins.className} bg-[#f9f5f2] font-display text-gray-900 dark:text-gray-100 overflow-x-hidden`}
			>
				<BackgroundDecorations />
				{children}
			</body>
		</html>
	);
}
