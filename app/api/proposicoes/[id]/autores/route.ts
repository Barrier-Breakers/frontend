import { NextResponse } from "next/server";

export async function GET(_: Request, context: any) {
	const params = await context.params;
	const idRaw = params?.id;
	console.debug("autores proxy params raw", JSON.stringify(params));
	const idStr = Array.isArray(idRaw) ? idRaw.join("/") : String(idRaw);
	const id = idStr.trim();
	const parsed = parseInt(id, 10);
	if (!id || Number.isNaN(parsed)) {
		console.warn("autores proxy invalid id param", idRaw);
		// Let the API handle invalid IDs; return a 400 for clarity
		return NextResponse.json(
			{ error: "Invalid proposition id", received: idRaw },
			{ status: 400 }
		);
	}
	const baseUrl = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${id}/autores`;

	try {
		console.debug("autores proxy request for", id, baseUrl, "params:", params);
		const res = await fetch(baseUrl, {
			headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (Next.js)" },
		});
		if (!res.ok) {
			const text = await res.text().catch(() => "");
			console.error(`autores proxy got non-ok status ${res.status}`, text.slice(0, 200));
			return NextResponse.json(
				{ error: res.statusText || "error", status: res.status, body: text.slice(0, 1000) },
				{ status: 502 }
			);
		}
		const json = await res.json();
		const items = (json?.dados || []) as Array<any>;

		const detailed = await Promise.all(
			items.map(async (it) => {
				// Orgão (judiciário) or other orgs, codTipo 50000
				if (it.codTipo === 50000) {
					return {
						name: it.nome,
						codTipo: it.codTipo,
						type: it.tipo || null,
						isOrg: true,
						ordemAssinatura: it.ordemAssinatura ?? null,
					};
				}

				if (!it.uri) {
					return {
						name: it.nome,
						codTipo: it.codTipo,
						ordemAssinatura: it.ordemAssinatura ?? null,
					};
				}

				try {
					console.debug("fetching author URI", it.uri);
					const r = await fetch(it.uri, {
						headers: {
							Accept: "application/json",
							"User-Agent": "Mozilla/5.0 (Next.js)",
						},
					});
					if (!r.ok) {
						return {
							name: it.nome,
							codTipo: it.codTipo,
							ordemAssinatura: it.ordemAssinatura ?? null,
						};
					}
					const j = await r.json();
					const dados = j?.dados || {};
					const ultimo = dados?.ultimoStatus || {};
					const party = ultimo?.siglaPartido || null;
					const uf = ultimo?.siglaUf || null;
					const email = ultimo?.gabinete?.email || ultimo?.email || null;
					const photo = ultimo?.urlFoto || dados?.urlFoto || null;
					const redes = dados?.redeSocial || null;

					return {
						id: dados?.id,
						name: it.nome || ultimo?.nome || dados?.nomeCivil || "",
						codTipo: it.codTipo,
						type: it.tipo || null,
						party,
						uf,
						email,
						photo,
						redes,
						ordemAssinatura: it.ordemAssinatura ?? null,
						isOrg: false,
					};
				} catch (err) {
					console.error("error fetching author detail", err);
					return {
						name: it.nome,
						codTipo: it.codTipo,
						ordemAssinatura: it.ordemAssinatura ?? null,
					};
				}
			})
		);

		// Sort by ordemAssinatura
		const filtered = detailed.filter(Boolean).sort((a, b) => {
			const aa = a?.ordemAssinatura ?? 0;
			const bb = b?.ordemAssinatura ?? 0;
			return aa - bb;
		});

		return NextResponse.json(
			{ dados: filtered },
			{ headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
		);
	} catch (err) {
		console.error("autores proxy error", err);
		return NextResponse.json({ dados: [] }, { status: 500 });
	}
}
