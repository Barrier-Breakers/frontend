import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

/**
 * Hook para proteger rotas que requerem autenticação
 * Redireciona para login se o usuário não estiver autenticado
 */
export function useProtectedRoute() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = authService.getAccessToken();

				if (!token) {
					// Sem token, redireciona para login
					router.push('/login');
					setIsLoading(false);
					return;
				}

				// Verifica se o token ainda é válido
				try {
					await authService.getCurrentUser(token);
					setIsAuthenticated(true);
				} catch (err) {
					// Token inválido ou expirado
					authService.clearTokens();
					router.push('/login');
				}
			} catch (error) {
				console.error('Erro ao verificar autenticação:', error);
				router.push('/login');
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	return { isLoading, isAuthenticated };
}
