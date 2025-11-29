"use client";
import React, { useEffect, useState } from "react";
import { getCodigoSituacaoNome } from "@/lib/json-helpers/codSituacao";
import { getSiglaTipoDocumento } from "@/lib/json-helpers/siglaTipo";
import { Suggestion } from "@/services/search.service";
import { formatDate } from "@/lib/utils";
import JsonTree from "@/components/ui/JsonTree";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
// `Card`, `Avatar`, and `Image` are rendered within `AuthorCard` component
import AuthorCard from "./AuthorCard";

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
				const res = await fetch(url, { signal: controller.signal });
				if (!res.ok) {
					if (cancelled) return;
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
				const res = await fetch(url, { signal: controller.signal });
				if (!res.ok) {
					if (cancelled) return;
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
		<div className="w-full max-w-full">
			<div className="space-y-6">
				<div className="flex flex-col">
					<span className="text-lg font-semibold">
						{getSiglaTipoDocumento(proposta.siglaTipo || "")} {ref}
					</span>
					<span className="text-muted-foreground wrap-break-word max-w-full">
						{proposta.descricaoSituacao}
					</span>
					<span className="text-muted-foreground wrap-break-word max-w-full">
						{formatDate(proposta.statusData, { includeTime: true })}
					</span>
				</div>

				<div className="flex flex-wrap gap-2 max-w-full">
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
								className="border-2 border-black text-md max-w-full wrap-break-word whitespace-normal"
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
						<p className="text-justify wrap-break-word whitespace-normal">
							{simplifiedText}
						</p>
					</div>
				) : (
					<>
						<div>
							<h1 className="font-semibold">Ementa</h1>
							<p className="wrap-break-word whitespace-normal">{proposta.ementa}</p>
						</div>
						<div>
							<h1 className="font-semibold">Despacho</h1>
							<p className="wrap-break-word whitespace-normal">{proposta.despacho}</p>
						</div>
					</>
				)}

				<div>
					<h1 className="font-semibold">Autores</h1>

					<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
								<AuthorCard key={`${a.id ?? i}-${a.name}`} author={a} />
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
