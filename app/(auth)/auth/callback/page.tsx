"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthCallback = () => {
	const router = useRouter();

	useEffect(() => {
		// Extrai tokens do hash
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);

		const accessToken = params.get("access_token");
		const refreshToken = params.get("refresh_token");
		const expiresIn = params.get("expires_in");

		if (accessToken) {
			// Armazena os tokens
			localStorage.setItem("access_token", accessToken);
			localStorage.setItem("refresh_token", refreshToken || "");
			localStorage.setItem("token_expires_at", String(Date.now() + Number(expiresIn) * 1000));

			// Redireciona para o noticias
			router.push("/noticias");
		} else {
			router.push("/login");
		}
	}, [router]);

	return <div>Autenticando...</div>;
};

export default AuthCallback;
