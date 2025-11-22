const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface SignUpData {
	email: string;
	password: string;
}

export interface SignInData {
	email: string;
	password: string;
}

export interface AuthResponse {
	session: {
		access_token: string;
		refresh_token?: string;
		expires_in?: number;
	};
	expires_in?: number;
}

export interface GoogleSignInData {
	redirectTo: string;
}

export interface GoogleSignInResponse {
	url: string;
}

export const authService = {
	async signUp(data: SignUpData): Promise<AuthResponse> {
		const response = await fetch(`${baseUrl}/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Erro ao criar conta");
		}

		return response.json();
	},

	async signIn(data: SignInData): Promise<AuthResponse> {
		const response = await fetch(`${baseUrl}/api/auth/signin`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Erro ao fazer login");
		}

		return response.json();
	},

	async signInWithGoogle(data: GoogleSignInData): Promise<GoogleSignInResponse> {
		const response = await fetch(`${baseUrl}/api/auth/signin/google`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Erro ao autenticar com Google");
		}

		return response.json();
	},

	async forgotPassword(email: string): Promise<void> {
		const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Erro ao enviar link de recuperação");
		}
	},

	async getCurrentUser(token: string): Promise<any> {
		const response = await fetch(`${baseUrl}/api/auth/me`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error("Erro ao buscar usuário");
		}

		return response.json();
	},

	async logout(token: string): Promise<void> {
		try {
			const response = await fetch(`${baseUrl}/api/auth/logout`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			// Se token está inválido/expirado (401), apenas limpa localmente
			if (response.status === 401) {
				console.warn("Token inválido ou expirado, limpando sessão local");
				this.clearTokens();
				return;
			}

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				throw new Error(error.message || `Erro ao fazer logout: ${response.status}`);
			}

			// Delete token from localStorage after successful logout
			this.clearTokens();
		} catch (error) {
			// Se houver erro de rede, ainda limpa tokens localmente
			console.error("Erro durante logout:", error);
			this.clearTokens();
			throw error;
		}
	},

	// Local storage helpers
	saveTokens(accessToken: string, refreshToken: string = "", expiresIn: number = 3600): void {
		localStorage.setItem("access_token", accessToken);
		localStorage.setItem("refresh_token", refreshToken);
		localStorage.setItem("token_expires_at", String(Date.now() + expiresIn * 1000));
	},

	clearTokens(): void {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("token_expires_at");
	},

	getAccessToken(): string | null {
		return localStorage.getItem("access_token");
	},

	isTokenValid(): boolean {
		const token = localStorage.getItem("access_token");
		const expiresAt = localStorage.getItem("token_expires_at");

		if (!token || !expiresAt) {
			return false;
		}

		return Date.now() < parseInt(expiresAt);
	},
};
