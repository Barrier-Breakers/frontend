"use client";
import React, { useEffect, useState } from "react";
import { getCodigoSituacaoNome } from "@/lib/json-helpers/codSituacao";
import { getSiglaTipoDocumento } from "@/lib/json-helpers/siglaTipo";
import { Suggestion } from "@/services/search.service";
import { formatDate } from "@/lib/utils";
import JsonTree from "@/components/ui/JsonTree";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const ProposicaoInsights = ({
	proposta,
	simplifiedText,
	activeVersion,
}: {
	proposta: Suggestion;
	simplifiedText: string | null;
	activeVersion: "original" | "simplificado";
}) => {
	const ref = proposta.siglaTipo
		? `${proposta.numero}/${proposta.ano}`
		: `Proposição ${proposta.id}`;

	const [temas, setTemas] = useState<{ codTema: number; tema: string; relevancia: number }[]>([]);
	const [loadingTemas, setLoadingTemas] = useState(false);

	type Author = {
		id?: number;
		name: string;
		codTipo: number;
		type?: string | null;
		party?: string | null;
		uf?: string | null;
		email?: string | null;
		photo?: string | null;
		redes?: string[] | null;
		ordemAssinatura?: number | null;
		isOrg?: boolean;
	};

	const [authors, setAuthors] = useState<Author[]>([]);
	const [loadingAuthors, setLoadingAuthors] = useState(false);

	useEffect(() => {
		if (!proposta?.id) {
			setTemas([]);
			return;
		}
		let cancelled = false;
		const controller = new AbortController();
		async function fetchTemas() {
			setLoadingTemas(true);
			try {
				const url = `/api/proposicoes/${proposta.id}/temas`;
				console.debug("fetching temas", url);
				const res = await fetch(url, { signal: controller.signal });
				if (!res.ok) {
					if (cancelled) return;
					let body = null;
					try {
						body = await res.json();
					} catch (e) {
						body = await res.text().catch(() => null);
					}
					console.warn("temas proxy returned non-ok", res.status, body);
					setTemas([]);
					return;
				}
				const json = await res.json();
				if (cancelled) return;
				const items = (json?.dados || []) as {
					codTema: number;
					tema: string;
					relevancia: number;
				}[];
				setTemas(items);
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") return;
				console.error("fetch temas error", err);
				setTemas([]);
			} finally {
				if (!cancelled) setLoadingTemas(false);
			}
		}
		fetchTemas();
		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [proposta?.id]);

	useEffect(() => {
		if (!proposta?.id) {
			setAuthors([]);
			return;
		}
		let cancelled = false;
		const controller = new AbortController();
		async function fetchAutores() {
			setLoadingAuthors(true);
			try {
				const url = `/api/proposicoes/${proposta.id}/autores`;
				console.debug("fetching autores", url);
				const res = await fetch(url, { signal: controller.signal });
				if (!res.ok) {
					if (cancelled) return;
					let body = null;
					try {
						body = await res.json();
					} catch (e) {
						body = await res.text().catch(() => null);
					}
					console.warn("autores proxy returned non-ok", res.status, body);
					setAuthors([]);
					return;
				}
				const json = await res.json();
				if (cancelled) return;
				const items = (json?.dados || []) as {
					id?: number;
					name: string;
					codTipo: number;
					type?: string;
					party?: string | null;
					uf?: string | null;
					email?: string | null;
					photo?: string | null;
					redes?: string[] | null;
					ordemAssinatura?: number;
					isOrg?: boolean;
				}[];

				// We already receive the detailed data from server-side proxy
				const detailed = items.map((it) => {
					if (!it) return null;
					return {
						id: (it as any).id,
						name: (it as any).name || (it as any).nome || "",
						codTipo: it.codTipo,
						type: it.type ?? null,
						party: (it as any).party ?? null,
						uf: (it as any).uf ?? null,
						email: (it as any).email ?? null,
						photo: (it as any).photo ?? null,
						redes: (it as any).redes ?? null,
						ordemAssinatura: it.ordemAssinatura ?? null,
						isOrg: (it as any).isOrg ?? false,
					} as Author;
				});

				if (cancelled) return;
				const filtered = detailed.filter(Boolean) as Author[];
				// Sort by assinatura order if present
				filtered.sort((a, b) => {
					const aa = a.ordemAssinatura ?? 0;
					const bb = b.ordemAssinatura ?? 0;
					return aa - bb;
				});
				setAuthors(filtered);
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") return;
				console.error("fetch autores error", err);
				setAuthors([]);
			} finally {
				if (!cancelled) setLoadingAuthors(false);
			}
		}
		fetchAutores();
		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [proposta?.id]);

	return (
		<div className="">
			<div className="space-y-6">
				<div className="flex flex-col">
					<span className="text-lg font-semibold">
						{getSiglaTipoDocumento(proposta.siglaTipo || "")} {ref}
					</span>
					<span className="text-muted-foreground">{proposta.descricaoSituacao}</span>
					<span className="text-muted-foreground">
						{formatDate(proposta.statusData, { includeTime: true })}
					</span>
				</div>

				<div className="flex flex-wrap gap-2">
					{loadingTemas ? (
						<>
							{[12, 24, 20].map((w, i) => (
								<Skeleton
									key={i}
									className={`h-6 rounded-full`}
									style={{ width: `${w}px` }}
								/>
							))}
						</>
					) : (
						temas.map((t) => (
							<Badge
								className="border-2 border-black text-md"
								key={t.codTema}
								variant="secondary"
							>
								{t.tema}
							</Badge>
						))
					)}
				</div>
				{activeVersion === "simplificado" ? (
					<div className="space-y-6">
						<h1 className="font-semibold text-lg">Texto simplificado</h1>
						<p className="text-justify indent-10">{simplifiedText}</p>
					</div>
				) : (
					<>
						<div>
							<h1 className="font-semibold">Ementa</h1>
							<p>{proposta.ementa}</p>
						</div>
						<div>
							<h1 className="font-semibold">Despacho</h1>
							<p>{proposta.despacho}</p>
						</div>
					</>
				)}

				<div>
					<h1 className="font-semibold">Autores</h1>

					<div className="mt-2 space-y-4">
						{loadingAuthors ? (
							<div className="flex flex-col gap-4">
								{[0, 1, 2].map((i) => (
									<div key={i} className="flex gap-4 items-center">
										<Skeleton className="h-12 w-12 rounded-full" />
										<div className="flex flex-col gap-2">
											<Skeleton className="h-4 w-48 rounded" />
											<Skeleton className="h-3 w-32 rounded" />
										</div>
									</div>
								))}
							</div>
						) : authors.length === 0 ? (
							<div className="text-muted-foreground">Sem autores informados</div>
						) : (
							authors.map((a, i) => (
								<div
									key={`${a.id ?? i}-${a.name}`}
									className="flex gap-4 items-start"
								>
									<div className="flex-shrink-0">
										<Card className="p-0 w-22 cardoso overflow-hidden!">
											<CardContent className="p-0">
												{a.photo ? (
													<Image
														width={44}
														height={44}
														src={a.photo}
														alt={a.name}
														className="w-full h-full"
													/>
												) : (
													<Avatar className="size-10">
														<AvatarFallback>
															{a.name
																.split(" ")
																.map((n) => n[0])
																.slice(0, 2)
																.join("")}
														</AvatarFallback>
													</Avatar>
												)}
											</CardContent>
										</Card>
									</div>
									<div className="flex flex-col">
										<span className="font-semibold">{a.name}</span>
										{!a.isOrg && (
											<>
												<div className="flex gap-2">
													<span className="text-muted-foreground">
														Partido:
													</span>
													<span className="font-semibold">
														{a.party ?? "-"}
													</span>
												</div>
												<div className="flex gap-2">
													<span className="text-muted-foreground">
														UF:
													</span>
													<span className="font-semibold">
														{a.uf ?? "-"}
													</span>
												</div>
												{a.email && (
													<div className="flex gap-2">
														<span className="text-muted-foreground">
															Email:
														</span>
														<a
															className="font-semibold"
															href={`mailto:${a.email}`}
														>
															{a.email}
														</a>
													</div>
												)}
												{a.redes && a.redes.length > 0 && (
													<div className="flex gap-2 items-center">
														<span className="text-muted-foreground">
															Redes sociais:
														</span>
														<div className="flex gap-2">
															{a.redes.map((r, idx) => {
																let host = r;
																try {
																	host = new URL(
																		r
																	).hostname.replace("www.", "");
																} catch (e) {
																	// ignore
																}
																return (
																	<a
																		key={idx}
																		href={r}
																		target="_blank"
																		rel="noreferrer"
																		className="text-blue-600 underline"
																	>
																		{host}
																	</a>
																);
															})}
														</div>
													</div>
												)}
											</>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* <div className="mt-2">
						<JsonTree data={proposta} name="proposta" defaultCollapsed={false} />
					</div> */}
			</div>
		</div>
	);
};

export default ProposicaoInsights;
