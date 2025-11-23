import { authService } from "./auth.service";

const envBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = envBaseUrl || "http://localhost:4000";

if (!baseUrl.startsWith("http")) {
	console.warn(
		"api.service: NEXT_PUBLIC_API_URL does not seem to be a full URL; requests may be sent to the wrong origin:",
		baseUrl
	);
}

export interface ApiRequestOptions extends RequestInit {
	headers?: Record<string, string>;
}

export const apiService = {
	async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
		// Ensure endpoint starts with a leading slash to avoid accidental concatenation errors
		const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
		const url = `${baseUrl}${normalizedEndpoint}`;

		if ((process.env.NODE_ENV || "development") === "development") {
			console.debug("api.service.request - fetching:", url, options?.method);
		}

		let token: string | null = null;
		if (typeof window !== "undefined") {
			token = authService.getAccessToken();
		}
		const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

		const mergedHeaders: Record<string, string> = {
			"Content-Type": "application/json",
			...(options.headers || {}),
		};

		if (token) mergedHeaders.Authorization = `Bearer ${token}`;

		const response = await fetch(url, {
			...options,
			headers: mergedHeaders,
		});

		if (!response.ok) {
			// Try to parse response body for a helpful error
			const text = await response.text().catch(() => "");
			let parsed: any = {};
			try {
				parsed = text ? JSON.parse(text) : {};
			} catch (e) {
				parsed = { text };
			}

			const message =
				parsed?.message ||
				parsed?.error ||
				text ||
				`Erro na requisição: ${response.status}`;
			// Include URL in the thrown error for easier debugging of incorrect baseUrl
			throw new Error(`${message} (${response.status}) - ${url}`);
		}

		return response.json();
	},

	async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
		return this.request<T>(endpoint, {
			method: "GET",
			headers,
		});
	},

	async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
			headers,
		});
	},

	async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: JSON.stringify(data),
			headers,
		});
	},

	async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
		return this.request<T>(endpoint, {
			method: "DELETE",
			headers,
		});
	},

	getAuthHeader(token: string): Record<string, string> {
		return {
			Authorization: `Bearer ${token}`,
		};
	},
};
