import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BackgroundDecorations from "@/components/BackgroundDecorations";
import Footer from "@/components/Footer";
import { ArrowRight, Newspaper, BookOpen, CheckCircle2, AlertTriangle } from "lucide-react";

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
		<div className="min-h-screen flex flex-col">
			{/* <BackgroundDecorations /> */}
			<div className="flex-1 relative z-10">
				<header className="p-4">
					<div className="container mx-auto flex justify-between items-center">
						<div className="flex items-center gap-2">
							<img
								src="/logo.webp"
								alt="Barrier Breakers Logo"
								className={`transition-all duration-300 max-w-20 ease-in-out w-10`}
							/>
							<h1 className="text-3xl font-bold">LegislAí.</h1>
						</div>
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
							<Link href="/login" className="text-lg font-medium hover:underline">
								<Button
									size="lg"
									variant="limanjar"
									className="cursor-pointer h-14 text-lg"
								>
									Fazer a diferença agora <ArrowRight />
								</Button>
							</Link>
						</div>
						<div className="flex justify-center items-center md:order-2">
							<Image
								src="/hero.png"
								alt="Imagem ilustrativa do Legislaí"
								width={1077}
								height={888}
								className="w-[500px] h-[412px] max-w-md md:max-w-none"
							/>
						</div>
					</section>
					<section className="container mx-auto py-12 md:py-16">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<DesignCard
								icon={
									<Newspaper className="w-12 h-12 text-black" strokeWidth={1.5} />
								}
								title="Acompanhe Notícias"
								description="Fique por dentro das últimas notícias sobre legislação e política local."
								className="cardoso p-4 gap-2 mexerica"
							/>
							<DesignCard
								icon={
									<BookOpen className="w-12 h-12 text-black" strokeWidth={1.5} />
								}
								title="Conheça a Legislação"
								description="Entenda as leis e projetos que impactam sua vida. Simplificamos o juridiquês para você."
								className="cardoso p-4 gap-2 chicletim"
							/>
							<DesignCard
								icon={
									<CheckCircle2
										className="w-12 h-12 text-black"
										strokeWidth={1.5}
									/>
								}
								title="Participe de Votações"
								description="Sua opinião é fundamental. Vote em propostas e mostre aos legisladores o que a população realmente deseja."
								className="cardoso p-4 gap-2 abacatino"
							/>
							<DesignCard
								icon={
									<AlertTriangle
										className="w-12 h-12 text-black"
										strokeWidth={1.5}
									/>
								}
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
