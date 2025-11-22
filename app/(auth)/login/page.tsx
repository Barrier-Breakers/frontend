"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";
import { authService } from "@/services/auth.service";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = authService.getAccessToken();

				if (!token) {
					setIsLoading(false);
					return;
				}

				// Verifica se o token ainda é válido
				await authService.getCurrentUser(token);
				// Usuário já está logado, redireciona para dashboard
				router.push("/noticias");
			} catch (err) {
				console.error("Erro ao verificar autenticação:", err);
				// Token inválido, remove e mostra página de login
				authService.clearTokens();
				setIsLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	if (isLoading) {
		return (
			<div className="flex w-full h-screen justify-center items-center">
				<div className="text-center">
					<Spinner className="w-10 h-10" />
				</div>
			</div>
		);
	}

	return <AuthModal />;
}
