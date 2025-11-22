const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface ApiRequestOptions extends RequestInit {
	headers?: Record<string, string>;
}

export const apiService = {
	async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
		const url = `${baseUrl}${endpoint}`;

		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || `Erro na requisição: ${response.status}`);
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
