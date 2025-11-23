"use client";
<script src="https://cdn.lordicon.com/lordicon.js"></script>;
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	StarIcon,
	CheckIcon,
	BookOpen,
	Map,
	Newspaper,
	Search,
	BarChart3,
	Heart,
	Leaf,
	Building2,
	TrendingUp,
	Users,
	ArrowLeft,
	ArrowRight,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

// TYPES & INTERFACES

interface Topic {
	id: string;
	icon: React.ReactNode;
	title: string;
	description: string;
}

interface OnboardingData {
	race: string;
	gender: string;
	ageRange: string;
	interestTopics: string[];
	termsAccepted: boolean;
	privacyAccepted: boolean;
}

// CONSTANTS

const RACE_OPTIONS = ["Branco", "Preto", "Pardo", "Amarelo", "Indígena", "Prefiro não informar"];
const GENDER_OPTIONS = ["Masculino", "Feminino", "Não-binário", "Prefiro não informar"];
const AGE_OPTIONS = [
	"Menos de 16",
	"16–18",
	"19–24",
	"25–34",
	"35–44",
	"45+",
	"Prefiro não informar",
];

const INTEREST_TOPICS: Topic[] = [
	{
		id: "education",
		icon: <BookOpen className=" scale-150" />,
		title: "Educação",
		description: "Políticas e notícias de educação",
	},
	{
		id: "politics",
		icon: <StarIcon className="scale-150" />,
		title: "Política",
		description: "Acompanhe política e legislativo",
	},
	{
		id: "leisure",
		icon: <Heart className=" scale-150" />,
		title: "Lazer",
		description: "Eventos e entretenimento",
	},
	{
		id: "environment",
		icon: <Leaf className=" scale-150" />,
		title: "Meio Ambiente",
		description: "Questões ambientais",
	},
	{
		id: "health",
		icon: <BarChart3 className=" scale-150" />,
		title: "Saúde",
		description: "Políticas de saúde pública",
	},
	{
		id: "transparency",
		icon: <Search className="scale-150" />,
		title: "Transparência",
		description: "Gastos e orçamento público",
	},
	{
		id: "culture",
		icon: <Newspaper className=" scale-150" />,
		title: "Cultura",
		description: "Eventos e políticas culturais",
	},
	{
		id: "infrastructure",
		icon: <Building2 className=" scale-150" />,
		title: "Infraestrutura",
		description: "Projetos de infraestrutura",
	},
];

// COMPONENTES UI

/** Card de tópico com animações e seleção visual */
const TopicCard = ({
	topic,
	isSelected,
	onClick,
}: {
	topic: Topic;
	isSelected: boolean;
	onClick: () => void;
}) => (
	<motion.div
		whileHover={{ scale: 1.02 }}
		whileTap={{ scale: 0.98 }}
		onClick={onClick}
		className="cursor-pointer h-full"
	>
		<Card
			className={cn(
				"cardoso p-4 gap-3 border-2 border-black transition-all relative h-[180px] flex flex-col items-start justify-start hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
				isSelected && "limanjar"
			)}
		>
			<AnimatePresence>
				{isSelected && (
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						exit={{ scale: 0, rotate: 180 }}
						transition={{ type: "spring", stiffness: 200, damping: 15 }}
						className="absolute top-3 right-3 bg-black rounded-full p-1"
					>
						<CheckIcon className="w-5 h-5 text-white stroke-[3]" />
					</motion.div>
				)}
			</AnimatePresence>
			<div className="aspect-square w-16 flex justify-center items-center rounded-full bg-white border-2 border-black">
				{topic.icon}
			</div>
			<div className="flex flex-col gap-1">
				<h3 className="text-lg font-bold">{topic.title}</h3>
				<p className="text-sm text-muted-foreground">{topic.description}</p>
			</div>
		</Card>
	</motion.div>
);

const getStepAnimation = (stepNumber: number) => {
	return {
		initial: { opacity: 0, y: 50 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -50 },
		transition: { duration: 0.3 },
	};
};

const ErrorMessage = ({
	message,
	maxWidth = "max-w-4xl",
}: {
	message: string;
	maxWidth?: string;
}) => (
	<div className={`${maxWidth} mx-auto`}>
		<span className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2 block">
			{message}
		</span>
	</div>
);

/** Select customizado com design system */
const SelectField = ({
	value,
	onValueChange,
	label,
	placeholder,
	options,
}: {
	value: string;
	onValueChange: (value: string) => void;
	label: string;
	placeholder: string;
	options: string[];
}) => (
	<div>
		<label className="block text-lg font-bold mb-3">{label}</label>
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className="w-full border-2 border-black rounded-lg px-4 py-3 font-semibold bg-white hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:ring-0 transition-all">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent className="border-2 border-black rounded-lg bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
				{options.map((option) => (
					<SelectItem
						key={option}
						value={option}
						className="px-4 py-2 cursor-pointer hover:bg-[#abfa00] focus:bg-[#abfa00] data-[state=checked]:bg-[#abfa00] font-semibold border-0"
					>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</div>
);

/** Indicador de progresso com animações */
const ProgressDots = ({ currentStep }: { currentStep: number }) => (
	<div className="flex items-center gap-3">
		{[1, 2, 3].map((dot) => (
			<motion.div
				key={dot}
				animate={{ scale: currentStep === dot ? 1.2 : 1 }}
				transition={{ duration: 0.3 }}
				className={cn(
					"w-3 h-3 rounded-full border-2",
					currentStep === dot
						? "border-[#abfa00] bg-[#abfa00]"
						: "border-gray-300 bg-white"
				)}
			/>
		))}
	</div>
);

// MAIN COMPONENT - ONBOARDING PAGE

/**
 * ONBOARDING PAGE - 3 PASSOS SIMPLIFICADOS
 *
 * ESTRUTURA:
 * Step 1: Informações Pessoais (Raça/Cor, Gênero, Idade)
 * Step 2: Tópicos de Interesse (até 8 seleções)
 * Step 3: Aceitar Termos e Política de Privacidade
 *
 * DADOS PARA BACKEND:
 * {
 *   race: string,
 *   gender: string,
 *   ageRange: string,
 *   interestTopics: string[],
 *   termsAccepted: boolean,
 *   privacyAccepted: boolean
 * }
 *
 * TODO: INTEGRAÇÃO COM BACKEND
 * 1. Descomentar fetch em handleNext (Step 3)
 * 2. Substituir URL: "/api/onboarding" com endpoint real
 * 3. Adicionar tratamento de erro e sucesso
 * 4. Implementar redirecionamento pós-onboarding
 */
export default function OnboardingPage() {
	const [step, setStep] = useState(1);
	const [data, setData] = useState<OnboardingData>({
		race: "",
		gender: "",
		ageRange: "",
		interestTopics: [],
		termsAccepted: false,
		privacyAccepted: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// HANDLERS

	const handleTopicToggle = useCallback((topicId: string) => {
		setData((prev) => {
			const topics = prev.interestTopics;
			return {
				...prev,
				interestTopics: topics.includes(topicId)
					? topics.filter((id) => id !== topicId)
					: topics.length < 8
						? [...topics, topicId]
						: topics,
			};
		});
	}, []);

	const handleCheckboxChange = useCallback(
		(field: "termsAccepted" | "privacyAccepted") => (checked: boolean) => {
			setData((prev) => ({ ...prev, [field]: checked }));
		},
		[]
	);

	const handleNext = useCallback(async () => {
		setError(""); // Limpar erro anterior

		if (step < 3) {
			// Validações por step
			if (step === 2 && data.interestTopics.length === 0) {
				setError(
					"Selecione pelo menos um tópico de interesse para personalizar sua experiência."
				);
				return;
			}

			setStep(step + 1);
			return;
		}

		// STEP 3: SUBMIT TO BACKEND
		setIsLoading(true);
		try {
			// Preparar payload convertendo strings vazias para null
			const payload = {
				...data,
				race: data.race || null,
				gender: data.gender || null,
				ageRange: data.ageRange || null,
			};

			// Validações básicas antes de enviar
			if (!payload.termsAccepted || !payload.privacyAccepted) {
				setError(
					"Você deve aceitar os Termos de Uso e Política de Privacidade para continuar."
				);
				return;
			}

			// Pegar token do localStorage
			const token = localStorage.getItem("access_token");
			if (!token) {
				setError("Sessão expirada. Faça login novamente.");
				setTimeout(() => {
					window.location.href = "/auth/login";
				}, 2000);
				return;
			}

			// Chamada para a API de onboarding
			console.log("Tentando onboardingh");
			console.log(payload);
			const result = await authService.completeOnboarding(payload, token);

			// SUCCESS: Redirecionar para página inicial
			console.log("✓ Onboarding completo - Dados salvos:", result);
			window.location.href = "/noticias";
		} catch (error) {
			console.error("✗ Erro no onboarding:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Erro ao finalizar. Tente novamente.";
			setError(`Erro: ${errorMessage}`);
		} finally {
			setIsLoading(false);
		}
	}, [step, data]);

	const handleGoBack = useCallback(() => {
		if (step > 1) setStep(step - 1);
	}, [step]);

	// Validação: Step 3 requer aceitar ambos os termos
	const canContinue = useMemo(() => {
		return step < 3 || (data.termsAccepted && data.privacyAccepted);
	}, [step, data]);

	//RENDER

	return (
		<div className="min-h-screen w-full flex flex-col">
			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
				<div className="w-full max-w-4xl">
					<AnimatePresence mode="wait">
						{/* STEP 1 - Personal Info */}
						{step === 1 && (
							<motion.div
								key="step1"
								{...getStepAnimation(1)}
								className="w-full flex flex-col gap-6"
							>
								<div className="text-center gap-2 flex flex-col">
									<h1 className="text-3xl md:text-4xl font-bold">
										Queremos conhecer um pouco mais sobre você
									</h1>
									<h2 className="text-lg md:text-xl text-muted-foreground font-semibold">
										Preencha os dados abaixo para começar
									</h2>
								</div>
								{error && <ErrorMessage message={error} maxWidth="max-w-2xl" />}
								<div className="space-y-6 max-w-2xl mx-auto w-full">
									<SelectField
										value={data.race}
										onValueChange={(value) =>
											setData((prev) => ({
												...prev,
												race: prev.race === value ? "" : value,
											}))
										}
										label="Raça/Cor"
										placeholder="Selecione..."
										options={RACE_OPTIONS}
									/>
									<SelectField
										value={data.gender}
										onValueChange={(value) =>
											setData((prev) => ({ ...prev, gender: value }))
										}
										label="Gênero"
										placeholder="Selecione..."
										options={GENDER_OPTIONS}
									/>
									<SelectField
										value={data.ageRange}
										onValueChange={(value) =>
											setData((prev) => ({ ...prev, ageRange: value }))
										}
										label="Idade"
										placeholder="Selecione..."
										options={AGE_OPTIONS}
									/>
								</div>
							</motion.div>
						)}

						{/* STEP 2 - Topics */}
						{step === 2 && (
							<motion.div
								key="step2"
								{...getStepAnimation(2)}
								className="w-full flex flex-col gap-6"
							>
								<div className="text-center gap-2 flex flex-col">
									<h1 className="text-3xl md:text-4xl font-bold">
										Tópicos de Interesse
									</h1>
									<h2 className="text-lg md:text-xl text-muted-foreground font-semibold">
										Tópicos de interesse servem para personalizarmos a sua
										página inicial mostrando notícias relevantes
									</h2>
								</div>
								{error && <ErrorMessage message={error} />}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
									{INTEREST_TOPICS.map((topic) => (
										<TopicCard
											key={topic.id}
											topic={topic}
											isSelected={data.interestTopics.includes(topic.id)}
											onClick={() => handleTopicToggle(topic.id)}
										/>
									))}
								</div>
							</motion.div>
						)}

						{/* STEP 3 - Terms */}
						{step === 3 && (
							<motion.div
								key="step3"
								{...getStepAnimation(3)}
								className="w-full flex flex-col gap-6"
							>
								<div className="text-center gap-2 flex flex-col">
									<h1 className="text-3xl md:text-4xl font-bold">
										Aceitar Termos e Condições
									</h1>
									<h2 className="text-lg md:text-xl text-muted-foreground font-semibold">
										Para finalizar a criação da sua conta
									</h2>
								</div>
								{error && <ErrorMessage message={error} maxWidth="max-w-3xl" />}
								<div className="space-y-6 max-w-3xl mx-auto w-full">
									<div className="cardoso border-2 bg-card rounded-lg p-6">
										<p className="text-base text-gray-800 leading-relaxed">
											Para utilizar a plataforma abc, você precisa aceitar
											nossos{" "}
											<a
												href="/termos-condicoes"
												target="_blank"
												rel="noopener noreferrer"
												className="underline text-blue-600 hover:text-blue-800 font-bold"
											>
												Termos de Uso
											</a>{" "}
											e nossa{" "}
											<a
												href="/politica-privacidade"
												target="_blank"
												rel="noopener noreferrer"
												className="underline text-blue-600 hover:text-blue-800 font-bold"
											>
												Política de Privacidade
											</a>
											. Lembramos que seus dados são protegidos de acordo com
											a Lei Geral de Proteção de Dados Pessoais (LGPD) e nunca
											serão compartilhados com terceiros sem seu
											consentimento.
										</p>
									</div>
									<div className="flex items-start gap-3 p-4 border-2 border-black rounded-lg hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all">
										<input
											type="checkbox"
											id="terms"
											checked={data.termsAccepted}
											onChange={(e) =>
												handleCheckboxChange("termsAccepted")(
													e.target.checked
												)
											}
											className="w-6 h-6 border-2 border-black rounded cursor-pointer mt-1"
										/>
										<Label
											htmlFor="terms"
											className="text-base font-semibold cursor-pointer flex-1"
										>
											Concordo com os{" "}
											<Link
												href="/termos-condicoes"
												target="_blank"
												rel="noopener noreferrer"
												className="underline text-blue-600 hover:text-blue-800"
											>
												Termos de Uso
											</Link>{" "}
											*
										</Label>
									</div>
									<div className="flex items-start gap-3 p-4 border-2 border-black rounded-lg hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all">
										<input
											type="checkbox"
											id="privacy"
											checked={data.privacyAccepted}
											onChange={(e) =>
												handleCheckboxChange("privacyAccepted")(
													e.target.checked
												)
											}
											className="w-6 h-6 border-2 border-black rounded cursor-pointer mt-1"
										/>
										<Label
											htmlFor="privacy"
											className="text-base font-semibold cursor-pointer flex-1"
										>
											Concordo com a{" "}
											<Link
												href="/politica-privacidade"
												target="_blank"
												rel="noopener noreferrer"
												className="underline text-blue-600 hover:text-blue-800"
											>
												Política de Privacidade
											</Link>{" "}
											*
										</Label>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Footer Navigation */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="border-t-2 border-black bg-white px-4 py-6 md:py-8"
			>
				<div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
					<ProgressDots currentStep={step} />
					<div className="flex items-center gap-3">
						{step > 1 && (
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Button
									variant="nevasca"
									size="lg"
									onClick={handleGoBack}
									className="font-bold"
								>
									<ArrowLeft />
									Voltar
								</Button>
							</motion.div>
						)}
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								variant="limanjar"
								size="lg"
								onClick={handleNext}
								disabled={!canContinue || isLoading}
								className="font-bold cursor-pointer"
							>
								{isLoading ? (
									<span className="flex items-center gap-2">
										Finalizando
										<Spinner />
									</span>
								) : step === 3 ? (
									<span className="flex items-center gap-2">
										Finalizar
										<ArrowRight />
									</span>
								) : (
									<span className="flex items-center gap-2">
										Continuar
										<ArrowRight />
									</span>
								)}
							</Button>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
