"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import InputFloat from "@/components/ui/input-label";
import Image from "next/image";
import { authService } from "@/services/auth.service";

type AuthMode = "login" | "register" | "forgot-password";

export default function AuthModal() {
	const router = useRouter();
	const [mode, setMode] = useState<AuthMode>("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (password !== confirmPassword) {
			setError("As senhas não coincidem");
			return;
		}

		setLoading(true);
		try {
			const data = await authService.signUp({ email, password, name });
			authService.saveTokens(
				data.session.access_token,
				data.session.refresh_token || "",
				data.session.expires_in || 3600
			);
			setSuccess("Conta criada com sucesso!");
			setEmail("");
			setPassword("");
			setConfirmPassword("");
			setName("");
			setMode("login");
			router.push("/onboarding");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const data = await authService.signIn({ email, password });
			authService.saveTokens(
				data.session.access_token,
				data.session.refresh_token || "",
				data.expires_in || 3600
			);
			setSuccess("Login realizado com sucesso!");
			setEmail("");
			setPassword("");
			// Redirecionar após 500ms para mostrar mensagem de sucesso
			setTimeout(() => {
				router.push("/noticias");
			}, 500);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const data = await authService.signInWithGoogle({
				redirectTo: `${window.location.origin}/auth/callback`,
			});
			window.location.href = data.url;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao autenticar com Google");
			setLoading(false);
		}
	};

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			await authService.forgotPassword(email);
			setSuccess("Link de recuperação enviado para seu email!");
			setEmail("");
			setMode("login");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao enviar link de recuperação");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		if (mode === "login") {
			await handleSignIn(e);
		} else if (mode === "register") {
			await handleSignUp(e);
		} else if (mode === "forgot-password") {
			await handleForgotPassword(e);
		}
	};

	const getTitle = () => {
		switch (mode) {
			case "login":
				return "Entrar";
			case "register":
				return "Criar Conta";
			case "forgot-password":
				return "Recuperar Senha";
		}
	};

	const getSubtitle = () => {
		switch (mode) {
			case "login":
				return "Bem-vindo de volta!";
			case "register":
				return "Crie sua nova conta";
			case "forgot-password":
				return "Recupere o acesso à sua conta";
		}
	};

	return (
		<div className="flex w-full h-screen justify-center items-center">
			<Card className="cardoso w-96 bg-amber-100">
				<CardContent>
					<div className="flex flex-col gap-4">
						{/* Header */}
						<div className="flex flex-col gap-2">
							<span className="text-xl font-bold">{getTitle()}</span>
							<span className="text-sm text-gray-600">{getSubtitle()}</span>
						</div>

						{/* Messages */}
						{error && (
							<div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
								{error}
							</div>
						)}
						{success && (
							<div className="p-3 bg-[#e3ffa8] border-2 border-[#6a940f] text-black font-semibold rounded">
								{success}
							</div>
						)}

						{/* Form */}
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							{/* Name Input - Only in Register */}
							{mode === "register" && (
								<InputFloat
									placeholder="Ex. Ana Silva"
									label="Nome"
									type="text"
									name="name"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							)}

							{/* Email Input */}
							<InputFloat
								placeholder="Ex. ana@email.com"
								label="Email"
								type="email"
								name="email"
								autoFocus
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							{/* Password Input - Hidden in Forgot Password */}
							{mode !== "forgot-password" && (
								<InputFloat
									placeholder="******"
									label="Senha"
									type="password"
									name="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							)}

							{/* Confirm Password Input - Only in Register */}
							{mode === "register" && (
								<InputFloat
									placeholder="******"
									label="Confirmar Senha"
									type="password"
									name="confirmPassword"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							)}

							{/* Forgot Password Link - Only in Login */}
							{mode === "login" && (
								<p className="text-right">
									<Button
										type="button"
										variant="link"
										onClick={() => setMode("forgot-password")}
										className="text-sm p-0 h-auto"
									>
										Esqueceu a senha?
									</Button>
								</p>
							)}

							{/* Submit Button */}
							<Button
								variant="limanjar"
								size="lg"
								className="text-lg w-full flex px-2! cursor-pointer"
								disabled={loading}
							>
								{loading ? "Processando..." : getTitle()}
							</Button>
						</form>

						{/* Divider */}
						<p className="text-center text-gray-600 font-semibold">ou</p>

						{/* Google Button */}
						<Button
							type="button"
							variant="nevasca"
							size="lg"
							className="text-lg w-full flex px-2! cursor-pointer"
							disabled={loading}
							onClick={handleGoogleSignIn}
						>
							{mode === "login" ? "Entre" : "Registre-se"} com o Google
							<Image width={16} height={16} src="/google.svg" alt="Google" />
						</Button>

						{/* Mode Toggle */}
						<div className="text-sm text-center space-y-2">
							{mode === "login" && (
								<p>
									Ainda não tem uma conta?{" "}
									<Button
										type="button"
										variant="link"
										onClick={() => {
											setMode("register");
											setError("");
											setSuccess("");
										}}
										className="p-0 h-auto"
									>
										Registre-se
									</Button>
								</p>
							)}

							{mode === "register" && (
								<p>
									Já tem uma conta?{" "}
									<Button
										type="button"
										variant="link"
										onClick={() => {
											setMode("login");
											setError("");
											setSuccess("");
										}}
										className="p-0 h-auto"
									>
										Faça login
									</Button>
								</p>
							)}

							{mode === "forgot-password" && (
								<p>
									<Button
										type="button"
										variant="link"
										onClick={() => {
											setMode("login");
											setError("");
											setSuccess("");
										}}
										className="p-0 h-auto"
									>
										Voltar ao login
									</Button>
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
