import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BackgroundDecorations from "@/components/BackgroundDecorations";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

type DesignCardProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
	className?: string;
};

const DesignCard = ({ icon, title, description, className = "" }: DesignCardProps) => {
	return (
		<Card className={cn(className, "border-black!")}>
			<div className="aspect-square w-20 flex justify-center items-center rounded-full bg-white border-2 border-black sombroso">
				{icon}
			</div>
			<h2 className="text-2xl font-bold mt-2">{title}</h2>
			<p className="text-base">{description}</p>
		</Card>
	);
};

export default function Home() {
	return (
		<div className="min-h-screen relative">
			{/* <BackgroundDecorations /> */}
			<div className="relative z-10">
				<header className="p-4">
					<div className="container mx-auto flex justify-between items-center">
						<h1 className="text-3xl font-bold">Legislaí.</h1>
						<div className="flex items-center space-x-4">
							<Link href="/login" className="text-lg font-medium hover:underline">
								<Button size="lg" variant="limanjar" className="cursor-pointer">
									Entrar
									<ArrowRight />
								</Button>
							</Link>
						</div>
					</div>
				</header>
				<main className="px-4 py-12 md:py-20">
					<section className="container mx-auto grid md:grid-cols-2 items-center gap-12 text-center md:text-left pb-20 md:pb-28">
						<div className="md:order-1">
							<h2 className="text-4xl md:text-6xl font-extrabold mb-4">
								Sua voz tem peso!
							</h2>
							<p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
								Participe, denuncie problemas e acompanhe as leis. Faça a diferença
								na sua comunidade com o Legislaí.
							</p>
							{/* <div className="flex justify-center md:justify-start">
								<a
									className="w-full sm:w-auto bg-brand-yellow text-black font-bold py-4 px-8 rounded-lg border-black-custom hard-shadow transition-all hover:shadow-none hover:translate-x-2 hover:translate-y-2 flex items-center justify-center gap-2 text-xl"
									href="#"
								>
									Faça a diferença agora
								</a>
							</div> */}
							<Link href="/login" className="text-lg font-medium hover:underline">
								<Button
									size="lg"
									variant="limanjar"
									className="cursor-pointer h-14 text-lg"
								>
									Fazer a diferença agora
								</Button>
							</Link>
						</div>
						<div className="flex justify-center items-center md:order-2">
							<div className="relative inline-block">
								<div className="absolute -top-4 -left-8 w-16 h-16 bg-[var(--brand-blue)] rounded-full"></div>
								<div className="absolute -bottom-4 -right-8 w-20 h-20 bg-[var(--brand-pink)] rounded-lg transform rotate-12"></div>
								<Image
									alt="Pessoa segurando um megafone, simbolizando que sua voz tem peso."
									className="relative w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-black-custom hard-shadow z-10"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFJmmbSK3rqWr_3HIqnR07zOB5ijmnvlNXRJ1voqs5IJJNwckYv1iIiTkHzlGX0C375MBZ1e1Vaf2FnzyJSWCv0QWIdRluf_fE6ZgMTGXaHKzkRWn11jVrOcGHStjynhhPSHywI6EpBUKhmell9os5V9-WgFOS12_Cp1voih113rDrUYczufhmw77Cklww0GgYo1LbMYqzpTtkyv86sHQamNYmZ01MeN0P8L5viKxKjuA6KjfRkCXZorhHMOlWacEX9tgNl_RBX6fe"
									width={256}
									height={256}
								/>
							</div>
						</div>
					</section>
					<section className="container mx-auto py-12 md:py-16">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<DesignCard
								icon={<span className="material-symbols-outlined text-4xl">i</span>}
								title="Acompanhe Notícias"
								description="Fique por dentro das últimas notícias sobre legislação e política local."
								className="cardoso p-4 gap-2 mexerica"
							/>
							<DesignCard
								icon={<span className="material-symbols-outlined text-4xl">i</span>}
								title="Conheça a Legislação"
								description="Entenda as leis e projetos que impactam sua vida. Simplificamos o juridiquês para você."
								className="cardoso p-4 gap-2 chicletim"
							/>
							<DesignCard
								icon={<span className="material-symbols-outlined text-4xl">i</span>}
								title="Participe de Votações"
								description="Sua opinião é fundamental. Vote em propostas e mostre aos legisladores o que a população realmente deseja."
								className="cardoso p-4 gap-2 abacatino"
							/>
							<DesignCard
								icon={<span className="material-symbols-outlined text-4xl">i</span>}
								title="Denuncie Problemas"
								description="Viu um problema no seu bairro? Use o Legislaí para reportar e mobilizar a comunidade e o poder público."
								className="cardoso p-4 gap-2 bananova"
							/>
						</div>
					</section>
				</main>
			</div>
			<Footer />
		</div>
	);
}
