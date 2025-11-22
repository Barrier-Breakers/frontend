import { useEffect, useState } from "react";

/**
 * Hook para carregar animações JSON do Lottie de forma dinâmica
 * Útil para evitar aumentar o bundle size importando todas as animações
 */
export function useLottieAnimation(animationPath: string) {
	const [animationData, setAnimationData] = useState<object | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const loadAnimation = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(animationPath);

				if (!response.ok) {
					throw new Error(`Falha ao carregar animação: ${response.statusText}`);
				}

				const data = await response.json();
				setAnimationData(data);
				setError(null);
			} catch (err) {
				const error = err instanceof Error ? err : new Error(String(err));
				setError(error);
				console.error("Erro ao carregar animação Lottie:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadAnimation();
	}, [animationPath]);

	return { animationData, isLoading, error };
}
