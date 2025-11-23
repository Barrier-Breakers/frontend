import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import InputFloat from "@/components/ui/input-label";
import InputFloatSuggest from "@/components/ui/input-float-suggest";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ArrowRight, StarIcon } from "lucide-react";

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

const Page = () => {
	return (
		<div className="w-full h-full flexs flex-col gap-4 pt-4">
			<div className="container m-auto flex flex-wrap justify-center gap-2 p-4">
				<h1 className="pl-2 font-bold text-xl w-full">Botões</h1>
				<Button variant="nevasca" size="lg" className="text-lg flex px-2!" align="right">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="limanjar" size="lg" className="text-lg flex px-2!">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="mexerica" size="lg" className="text-lg flex px-2!">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="chicletim" size="lg" className="text-lg flex px-2!">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="folheto" size="lg" className="text-lg flex px-2!">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="bananova" size="lg" className="text-lg flex px-2!">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="jabutina" size="lg" className="text-lg flex px-2!">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="frambos" size="lg" className="text-lg flex px-2!">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="abacatino" size="lg" className="text-lg flex px-2!">
					Design System Button
					<ArrowRight className="w-5! h-5! stroke-3" />
				</Button>
				<Button variant="piscina" size="lg" className="text-lg flex px-2!" disabled>
					Design System Button
					{/* <ArrowRight className="w-5! h-5! stroke-3" /> */}
					<Spinner className="w-5 stroke-3" />
				</Button>
			</div>

			<div className="container m-auto flex flex-wrap justify-center gap-4 p-4">
				<h1 className="pl-2 font-bold text-xl w-full">Cards</h1>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 limanjar"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 mexerica"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 chicletim"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 folheto"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 bananova"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 jabutina"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 frambos"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 abacatino"
				/>
				<DesignCard
					icon={<StarIcon className="fill-black scale-150" />}
					title="Design System Card"
					description="This is a sample card component using the design system styles."
					className="max-w-80 cardoso p-4 gap-2 piscina"
				/>
			</div>

			<div className="container m-auto flex flex-wrap justify-center gap-4 p-4">
				<h1 className="pl-2 font-bold text-xl w-full">Inputs</h1>
				<InputFloat label="Nome completo" className="max-w-sm" />
				<InputFloat label="Endereço de e-mail" className="max-w-sm" />
				<InputFloat label="Senha" type="password" className="max-w-sm" />
				<div className="w-full max-w-sm">
					<InputFloatSuggest label="Pesquisar" placeholder="Pesquisar..." />
				</div>
			</div>
		</div>
	);
};

export default Page;
