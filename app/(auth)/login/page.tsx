"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";
import { authService } from "@/services/auth.service";
import { Spinner } from "@/components/ui/spinner";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
			<div className="flex flex-col h-screen overflow-hidden">
				<header className="flex-shrink-0 p-4">
					<div className="container">
						<div className="flex items-center gap-2">
							<img
								src="/logo.webp"
								alt="Barrier Breakers Logo"
								className={`transition-all duration-300 max-w-20 ease-in-out w-10`}
							/>
							<h1 className="text-3xl font-bold">LegislAí.</h1>
						</div>
					</div>
				</header>
				<div className="flex-1 flex items-center justify-center overflow-hidden">
					<div className="text-center">
						<Spinner className="w-10 h-10" />
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen overflow-hidden">
			<header className="flex-shrink-0 p-4 px-5">
				<div className="container mx-auto flex justify-between items-center">
					<div className="flex items-center gap-2">
						<img
							src="/logo.webp"
							alt="Barrier Breakers Logo"
							className={`transition-all duration-300 max-w-20 ease-in-out w-10`}
						/>
						<h1 className="text-3xl font-bold">LegislAí.</h1>
					</div>
					<div className="flex items-center space-x-4">
						<Link href="/">
							<Button variant="nevasca" className="cursor-pointer" size="lg">
								<ArrowLeft />
								Voltar
							</Button>
						</Link>
					</div>{" "}
				</div>
			</header>
			<div className="flex-1 flex items-center justify-center overflow-hidden">
				<AuthModal />
			</div>
			<Footer />
		</div>
	);
}
