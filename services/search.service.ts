import { apiService } from "./api.service";

export type Suggestion = {
	id: number;
	uri?: string | null;
	siglaTipo?: string | null;
	numero?: number | null;
	ano?: number | null;
	ementa?: string | null;
	urlInteiroTeor?: string | null;
	[key: string]: any;
};

export const searchService = {
	async suggest(query: string): Promise<Suggestion[]> {
		if (!query || query.length < 1) return [];

		// Fallback to a local stub while backend may not be available
		if (!process.env.NEXT_PUBLIC_API_URL) {
			const all = [
				{
					id: 1,
					siglaTipo: "REQ",
					numero: 5008,
					ano: 2025,
					ementa: "Requer MOÇÃO DE APLAUSO a Cabo da Polícia Militar de Santa Catarina, EMILY ROSANE PEREIRA",
					uri: null,
				},
				{
					id: 2,
					siglaTipo: "TVR",
					numero: 1099,
					ano: 2025,
					ementa: "Autorização - Rádio Comunitária - Dez anos",
					uri: null,
				},
			];
			return all.filter((s) => (s.ementa || "").toLowerCase().includes(query.toLowerCase()));
		}

		try {
			const endpoint = `/api/proposicoes/search?q=${encodeURIComponent(query)}&limit=5`;
			if ((process.env.NODE_ENV || "development") === "development") {
				const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
				console.debug("search.service.suggest: fetching", `${base}${endpoint}`);
			}
			// API returns { data: [...], total, limit, offset }
			const res = await apiService.get<{ data: Suggestion[] }>(endpoint);
			if (!res || !Array.isArray(res.data)) return [];
			// Return full objects returned by the API (no mapping to a subset of fields)
			return res.data;
		} catch (err) {
			console.error("searchService.suggest error", err);
			return [];
		}
	},
};

export default searchService;
