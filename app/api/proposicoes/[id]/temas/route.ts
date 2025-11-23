import { NextResponse } from "next/server";

export async function GET(_: Request, context: any) {
	const params = await context.params;
	const idRaw = params?.id;
	console.debug("temas proxy params raw", JSON.stringify(params));
	const idStr = Array.isArray(idRaw) ? idRaw.join("/") : String(idRaw);
	const id = idStr.trim();
	const parsed = parseInt(id, 10);
	if (!id || Number.isNaN(parsed)) {
		console.warn("temas proxy invalid id param", idRaw);
		return NextResponse.json(
			{ error: "Invalid proposition id", received: idRaw },
			{ status: 400 }
		);
	}
	const baseUrl = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${id}/temas`;

	try {
		console.debug("temas proxy request for", id, baseUrl, "params:", params);
		const res = await fetch(baseUrl, {
			headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (Next.js)" },
		});
		if (!res.ok) {
			const text = await res.text().catch(() => "");
			console.error(`temas proxy got non-ok status ${res.status}`, text.slice(0, 200));
			return NextResponse.json(
				{ error: res.statusText || "error", status: res.status, body: text.slice(0, 1000) },
				{ status: 502 }
			);
		}
		const json = await res.json();
		const items = json?.dados || [];
		return NextResponse.json(
			{ dados: items },
			{ headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
		);
	} catch (err) {
		console.error("temas proxy error", err);
		return NextResponse.json({ dados: [] }, { status: 500 });
	}
}
