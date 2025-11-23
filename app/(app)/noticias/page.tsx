"use client";

import { useState } from "react";
import { ThumbsUp, MessageCircle, Share2, ArrowLeft } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type NewsItem = {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	author?: string;
	content: string[];
	image?: string;
	tags?: string[];
	commentsCount?: number;
	readTime?: number; // minutos estimados
};

const sampleNews: NewsItem[] = [
	{
		id: 1,
		title: "Auditoria revela inconsistências em licitações",
		excerpt: "Relatório preliminar aponta indícios de sobrepreço em contratos públicos.",
		date: new Date().toISOString(),
		author: "Equipe de Reportagem",
		image: "https://picsum.photos/seed/lic1/1200/600",
		tags: ["Licitação", "Fiscalização"],
		commentsCount: 12,
		readTime: 3,
		content: [
			"Este é um exemplo de notícia. O conteúdo real ainda está sendo desenvolvido para o hackathon.",
			"O relatório preliminar indica possíveis irregularidades em contratos e as primeiras indicações apontam para sobrepreço. As autoridades estão apurando os dados e devem se pronunciar nos próximos dias.",
			"Enquanto isso, as equipes de fiscalização local seguem trabalhando com apoio da comunidade e de órgãos de controle para coletar evidências e ouvir testemunhas.",
		],
	},
	{
		id: 4,
		title: "Escola recebe verba para reforma de quadra",
		excerpt: "Recursos vão revitalizar infraestrutura esportiva de escola municipal.",
		date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
		author: "Assessoria de Comunicação",
		image: "https://picsum.photos/seed/escola4/1200/600",
		tags: ["Educação", "Investimento"],
		commentsCount: 3,
		readTime: 2,
		content: [
			"A prefeitura anunciou recursos destinados à reforma da quadra esportiva de uma escola municipal.",
			"Pais e professores comemoram, e a secretaria de educação garante que o processo de contratação será transparente.",
		],
	},
	{
		id: 5,
		title: "Plataforma de denúncia ganha atualização",
		excerpt: "Nova versão traz ferramentas de geolocalização e anexo de evidências.",
		date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
		author: "Equipe Técnica",
		image: "https://picsum.photos/seed/denuncia5/1200/600",
		tags: ["Tecnologia", "Cidadania"],
		commentsCount: 6,
		readTime: 3,
		content: [
			"A atualização visa facilitar a inclusão de provas e a visualização de relatos no mapa interativo.",
			"Usuários podem anexar imagens e documentos para fortalecer denúncias e dar mais precisão ao trabalho das ouvidorias.",
		],
	},
	{
		id: 6,
		title: "Sindicato alerta para risco de atraso em pagamentos",
		excerpt: "Categoria reivindica medidas para evitar paralisação em serviços essenciais.",
		date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
		author: "Sindicato Local",
		image: "https://picsum.photos/seed/sindicato6/1200/600",
		tags: ["Trabalho", "Serviços Públicos"],
		commentsCount: 9,
		readTime: 4,
		content: [
			"Reuniões entre sindicato e governo buscam solucionar divergências e evitar impacto aos usuários dos serviços.",
			"Representantes pedem diálogo e garantias contratuais para os profissionais afetados.",
		],
	},
	{
		id: 7,
		title: "Câmara aprova projeto para incentivo à reciclagem",
		excerpt: "Programa pode gerar renda e reduzir descarte incorreto de resíduos.",
		date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
		author: "Vereadores",
		image: "https://picsum.photos/seed/reciclagem7/1200/600",
		tags: ["Meio Ambiente", "Política"],
		commentsCount: 10,
		readTime: 3,
		content: [
			"Programa estimula criação de cooperativas e pontos de coleta seletiva em bairros da cidade.",
			"A medida faz parte de um conjunto de ações ambientais votadas em sessão extraordinária.",
		],
	},
	{
		id: 8,
		title: "Comunidade participa de audiência pública sobre saúde",
		excerpt:
			"Moradores discutem prioridades e a qualidade de atendimento nas unidades básicas.",
		date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
		author: "Portal Saúde",
		image: "https://picsum.photos/seed/saude8/1200/600",
		tags: ["Saúde", "Participação"],
		commentsCount: 7,
		readTime: 5,
		content: [
			"A audiência recebeu queixas e sugestões sobre horários de atendimento e qualidade dos serviços.",
			"Secretaria de saúde apresentou balanço e metas para o próximo semestre, com foco na ampliação de serviços básicos.",
		],
	},
	{
		id: 2,
		title: "Projeto de lei propõe transparência em contratações",
		excerpt: "A proposta visa aumentar a abertura de dados e mecanismos de fiscalização.",
		date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
		author: "Redação",
		image: "https://picsum.photos/seed/transp2/1200/600",
		tags: ["Projeto de Lei", "Transparência"],
		commentsCount: 4,
		readTime: 5,
		content: [
			"A proposta visa aumentar a abertura de dados e mecanismos de fiscalização, trazendo mais clareza nos processos licitatórios e contratos públicos.",
			"Segundo especialistas, medidas adicionais de transparência podem reduzir a ocorrência de fraudes e facilitar a participação de cidadãos na fiscalização.",
			"Os debatedores destacam a importância da tecnologia e dados abertos para acompanhar gastos públicos de forma contínua.",
		],
	},
	{
		id: 3,
		title: "Comunidade alerta sobre desvio de verbas",
		excerpt: "Moradores denunciam uso inadequado de recursos em obra local.",
		date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
		author: "Correspondente Local",
		image: "https://picsum.photos/seed/verba3/1200/600",
		tags: ["Denúncia", "Obra Pública"],
		commentsCount: 21,
		readTime: 4,
		content: [
			"Moradores denunciam uso inadequado de recursos em obra local, alegando atraso e alteração de especificações técnicas.",
			"A prefeitura afirmou que irá abrir investigação e revisar o contrato com a empresa responsável para garantir a conformidade.",
			"A comunidade planeja uma reunião com vereadores para solicitar informações sobre o processo e os próximos passos da fiscalização.",
		],
	},
];

export default function NoticiasPage() {
	const [activeNews, setActiveNews] = useState<NewsItem | null>(null);
	const totalCount = sampleNews.length;

	function openNews(news: NewsItem) {
		setActiveNews(news);
	}

	function closeNews() {
		setActiveNews(null);
	}

	function getInitials(name?: string) {
		if (!name) return "?";
		return name
			.split(" ")
			.map((s) => s[0])
			.slice(0, 2)
			.join("")
			.toUpperCase();
	}

	return (
		<div className="relative">
			{/* <BackgroundDecorations /> */}
			<PageTitle
				title="Notícias"
				description={`Página de notícias (placeholder). Ainda estamos construindo a integração completa; por enquanto, aqui existem exemplos de notícias. Clique em um card para ver os detalhes na mesma página.`}
			/>

			<div className="px-8 -mt-2 mb-4 flex items-center justify-between">
				<h2 className="text-sm text-muted-foreground">
					Últimas notícias • {totalCount} itens
				</h2>
				<div className="text-xs text-muted-foreground">
					Exibir por: <strong>Mais recentes</strong>
				</div>
			</div>

			{activeNews ? (
				<div className="p-8">
					<Button variant="nevasca" onClick={closeNews} className="mb-6">
						<ArrowLeft />
						Voltar
					</Button>
					<Card className="transition-shadow cardoso py-0">
						{activeNews.image && (
							<div className="relative h-36 w-full overflow-hidden rounded-t-xl">
								<img
									src={activeNews.image}
									alt={activeNews.title}
									className="w-full h-full object-cover"
								/>
							</div>
						)}
						<CardHeader>
							<CardTitle>{activeNews.title}</CardTitle>
							<CardDescription>
								{formatDate(activeNews.date, { includeTime: true })} •{" "}
								{activeNews.author} • {activeNews.readTime} min
							</CardDescription>
						</CardHeader>
						<CardContent className="pb-6">
							<div className="flex gap-2 mb-4 flex-wrap">
								{(activeNews.tags ?? []).map((t) => (
									<Badge key={t} className="bg-muted px-2 py-1 text-xs">
										{t}
									</Badge>
								))}
							</div>
							<div className="space-y-4 text-sm">
								{activeNews.content.map((p, idx) => (
									<p key={idx} className="text-muted-foreground">
										{p}
									</p>
								))}
							</div>
							<div className="mt-6 border-t pt-4 flex items-center justify-between gap-4">
								<div className="flex items-center gap-4">
									<button className="inline-flex items-center gap-2 text-muted-foreground hover:text-black">
										<ThumbsUp size={16} />
										<span>Curtir</span>
									</button>
									<button className="inline-flex items-center gap-2 text-muted-foreground hover:text-black">
										<MessageCircle size={16} />
										<span>{activeNews.commentsCount} comentários</span>
									</button>
								</div>
								<button className="inline-flex items-center gap-2 text-muted-foreground hover:text-black">
									<Share2 size={16} />
									<span>Compartilhar</span>
								</button>
							</div>
							<div className="mt-6">
								<h3 className="font-semibold">Comentários</h3>
								<div className="mt-2 space-y-2">
									<div className="p-3 bg-muted rounded-md">
										<div className="flex items-center gap-2">
											<Avatar>
												<AvatarFallback>
													{getInitials("Maria A.")}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="text-sm font-medium">Maria A.</div>
												<div className="text-xs text-muted-foreground">
													Interessante — é essencial que a fiscalização
													avance.
												</div>
											</div>
										</div>
									</div>
									<div className="p-3 bg-muted rounded-md">
										<div className="flex items-center gap-2">
											<Avatar>
												<AvatarFallback>
													{getInitials("João P.")}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="text-sm font-medium">João P.</div>
												<div className="text-xs text-muted-foreground">
													Precisamos de mais transparência nesses
													contratos.
												</div>
											</div>
										</div>
									</div>
									<div className="mt-8">
										<h3 className="font-semibold mb-4">Mais notícias</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											{sampleNews
												.filter((s) => s.id !== activeNews.id)
												.slice(0, 2)
												.map((s) => (
													<div
														key={s.id}
														className="cursor-pointer"
														onClick={() => openNews(s)}
														tabIndex={0}
														role="button"
														onKeyDown={(e) => {
															if (e.key === "Enter" || e.key === " ")
																openNews(s);
														}}
													>
														<div className="flex gap-3 items-start">
															<div className="relative h-16 w-28 overflow-hidden rounded-md">
																{s.image ? (
																	<img
																		src={s.image}
																		alt={s.title}
																		className="w-full h-full object-cover"
																	/>
																) : (
																	<div className="h-16 w-28 bg-muted" />
																)}
															</div>
															<div>
																<div className="text-sm font-medium">
																	{s.title}
																</div>
																<div className="text-xs text-muted-foreground">
																	{formatDate(s.date, {
																		short: true,
																	})}{" "}
																	• {s.readTime} min
																</div>
															</div>
														</div>
													</div>
												))}
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			) : (
				<div className="p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{sampleNews.map((n) => (
						<div key={n.id}>
							<Card
								className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden h-full cardoso py-0"
								onClick={() => openNews(n)}
								tabIndex={0}
								role="button"
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") openNews(n);
								}}
							>
								<CardContent className="p-0">
									<div className="relative h-40 w-full overflow-hidden">
										{n.image ? (
											<img
												src={n.image}
												alt={n.title}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="h-40 w-full bg-muted" />
										)}
									</div>
									<div className="p-4">
										<div className="flex items-center gap-2 mb-2 flex-wrap">
											{(n.tags ?? []).map((t) => (
												<Badge
													key={t}
													className="bg-muted px-2 py-1 text-xs text-black border-2 border-black"
												>
													{t}
												</Badge>
											))}
										</div>
										<h3 className="font-semibold text-lg mb-1">{n.title}</h3>
										<p className="text-sm text-muted-foreground mb-2">
											{n.excerpt}
										</p>
										<div className="text-xs text-muted-foreground flex items-center justify-between">
											<div className="flex items-center justify-between w-full gap-2">
												<span className="text-black">{n.author}</span>
												{/* <span>•</span> */}
												<span>{formatDate(n.date, { short: true })}</span>
												{/* <span>•</span> */}
												{/* <span>{n.readTime} min</span> */}
											</div>
											{/* <div className="text-muted-foreground">
												{n.commentsCount} comentários
											</div> */}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
