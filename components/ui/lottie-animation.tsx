"use client";

import React, { CSSProperties } from "react";
import Lottie from "react-lottie";

export interface LottieAnimationProps {
	/** Arquivo JSON da animação do Lottie */
	animationData: object;
	/** Se a animação deve ser reproduzida automaticamente (padrão: true) */
	autoplay?: boolean;
	/** Se a animação deve fazer loop (padrão: true) */
	loop?: boolean;
	/** Velocidade da animação (padrão: 1) */
	speed?: number;
	/** Largura da animação em pixels (padrão: 100) */
	width?: number | string;
	/** Altura da animação em pixels (padrão: 100) */
	height?: number | string;
	/** Classe CSS customizada */
	className?: string;
	/** Estilos inline adicionais */
	style?: CSSProperties;
	/** Callback quando a animação termina */
	onComplete?: () => void;
	/** Se a animação está pausada (padrão: false) */
	isPaused?: boolean;
	/** Renderizar como ícone com tamanho fixo */
	asIcon?: boolean;
	/** Cor do ícone (se asIcon = true) */
	iconColor?: string;
}

/**
 * Componente Lottie para exibir animações JSON do Lottie Files
 *
 * @example
 * // Como ícone
 * <LottieAnimation
 *   animationData={successAnimation}
 *   asIcon
 *   width={24}
 *   height={24}
 * />
 *
 * @example
 * // Como animação completa
 * <LottieAnimation
 *   animationData={loadingAnimation}
 *   loop
 *   width={200}
 *   height={200}
 * />
 */
export const LottieAnimation = React.forwardRef<HTMLDivElement, LottieAnimationProps>(
	(
		{
			animationData,
			autoplay = true,
			loop = true,
			speed = 1,
			width = 100,
			height = 100,
			className = "",
			style,
			onComplete,
			isPaused = false,
			asIcon = false,
			iconColor,
		},
		ref
	) => {
		const defaultOptions = {
			loop,
			autoplay,
			animationData,
			rendererSettings: {
				preserveAspectRatio: "xMidYMid slice",
			},
		};

		const containerStyle: CSSProperties = {
			width: asIcon ? width : width,
			height: asIcon ? height : height,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			...style,
		};

		// Se tiver cor customizada para ícone, usamos um container com filtro
		const finalStyle = iconColor
			? {
					...containerStyle,
					filter: `hue-rotate(0deg) brightness(1)`,
				}
			: containerStyle;

		return (
			<div ref={ref} className={className} style={finalStyle}>
				<Lottie
					options={defaultOptions}
					isPaused={isPaused}
					speed={speed}
					eventListeners={
						onComplete
							? [
									{
										eventName: "complete",
										callback: onComplete,
									},
								]
							: []
					}
				/>
			</div>
		);
	}
);

LottieAnimation.displayName = "LottieAnimation";
