"use client";

import React from "react";
import { PageTitle } from "@/components/layout/PageTitle";
import InputFloatSuggest from "@/components/ui/input-float-suggest";
import { Button } from "@/components/ui/button";
import type { Suggestion } from "@/services/search.service";
import ProposicaoDetails from "@/components/pesquisa/ProposicaoDetails";
import { X } from "lucide-react";

export default function PesquisaPage() {
	// amostra de dados (substituir por hooks/services quando necessário)
	type RecentItem = { label: string; suggestion?: Suggestion | null };
	const [recentSearches, setRecentSearches] = React.useState<RecentItem[]>([]);
	const [searchValue, setSearchValue] = React.useState("");
	const [selectedProposicao, setSelectedProposicao] = React.useState<Suggestion | null>(null);
	const [suppressNextFetch, setSuppressNextFetch] = React.useState(false);

	const suggestedTopics = [
		"Educação",
		"Saúde",
		"Orçamento",
		"Transparência",
		"Direitos Humanos",
		"Meio Ambiente",
	];

	return (
		<div>
			<PageTitle
				title="Pesquisa Legislativa"
				description="Explore matérias, projetos, emendas e documentos públicos da legislatura."
			/>

			<div className="mx-auto max-w-6xl p-8">
				{selectedProposicao ? (
					<ProposicaoDetails
						proposta={selectedProposicao}
						onBack={() => {
							setSuppressNextFetch(true);
							setSelectedProposicao(null);
						}}
					/>
				) : (
					<>
						<div className="flex justify-center mb-8">
							<div className="w-full">
								<div className="relative">
									<div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
										<svg
											className="h-5 w-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M21 21l-4.35-4.35"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<circle
												cx="11.5"
												cy="11.5"
												r="5.5"
												stroke="currentColor"
												strokeWidth="1.5"
											/>
										</svg>
									</div>
									<InputFloatSuggest
										label="Pesquisar"
										placeholder="Pesquisar projetos, leis, palavras-chave..."
										value={searchValue}
										onChange={(v) => setSearchValue(v)}
										onSelect={(s) => {
											const label = s?.siglaTipo
												? `${s.siglaTipo} ${s.numero}/${s.ano} — ${s.ementa}`
												: s.ementa || "";
											setRecentSearches((prev) =>
												[
													{ label, suggestion: s },
													...prev.filter((x) => x.label !== label),
												].slice(0, 8)
											);

											// Open details when user clicks a suggestion
											setSelectedProposicao(s ?? null);
										}}
										suppressNextFetch={suppressNextFetch}
										onSuppressConsumed={() => setSuppressNextFetch(false)}
									/>
								</div>
							</div>
						</div>

						{/* Recent searches header (not a Card) */}
						<div className="mb-6">
							<div className="flex items-start justify-between">
								<div>
									<h3 className="text-xl font-semibold">Buscas recentes</h3>
									<div className="text-sm text-muted-foreground">
										Rápido acesso às pesquisas anteriores
									</div>
								</div>
								{recentSearches.length > 0 && (
									<Button
										variant="frambos"
										size="sm"
										onClick={() => setRecentSearches([])}
										className="cursor-pointer"
									>
										<X />
										Limpar
									</Button>
								)}
							</div>

							{/* Recent search rows (simple divs, not Cards) */}
							<div className="mt-4 flex flex-col gap-3">
								{recentSearches.length === 0 && (
									<div className="rounded-md text-center px-4 py-3 text-md">
										Você ainda não tem pesquisas recentes. Experimente pesquisar
										por um tema, projeto ou deputado para começar.
									</div>
								)}
								{recentSearches.map((r) => {
									const s = r.suggestion;
									const title = s
										? `${s.siglaTipo ?? ""} ${s.numero ?? ""}/${s.ano ?? ""}`.trim()
										: r.label;
									const description =
										s?.ementa ?? (r.label && !s ? r.label : undefined);

									return (
										<div
											key={r.label}
											className="flex items-start justify-between rounded-md border px-4 py-3 bg-card cardoso"
										>
											<div className="flex-1 min-w-0">
												<div className="text-sm font-semibold truncate">
													{title}
												</div>
												{description && (
													<div className="text-sm text-muted-foreground mt-1 line-clamp-2">
														{description}
													</div>
												)}
											</div>
											<div className="ml-4 flex items-end">
												<Button
													variant="limanjar"
													className="cursor-pointer"
													size="sm"
													onClick={() => {
														if (r.suggestion)
															setSelectedProposicao(r.suggestion);
													}}
													disabled={!r.suggestion}
												>
													Ver
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* (Details are rendered above replacing the search UI when selected) */}

						{/* Topics (simple div, buttons instead of badges) */}
						<div className="mb-6">
							<div className="flex items-start justify-between">
								<div>
									<h3 className="text-xl font-semibold">
										Tópicos que podem te interessar
									</h3>
									<div className="text-sm text-muted-foreground">
										Selecione um tópico para começar
									</div>
								</div>
							</div>

							<div className="mt-4 flex flex-wrap gap-2">
								{suggestedTopics.map((topic) => (
									<Button
										key={topic}
										variant="nevasca"
										className="text-sm cursor-pointer"
										size="sm"
										onClick={() => {
											// Only set the topic as current search value to trigger suggestions.
											setSearchValue(topic);
										}}
									>
										{topic}
									</Button>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
