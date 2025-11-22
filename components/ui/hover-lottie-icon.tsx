"use client";

import React, { useEffect, useRef } from "react";
import { LottieAnimation } from "./lottie-animation";
import { cn } from "@/lib/utils";

export interface HoverLottieIconProps {
	/** Arquivo JSON da animação do Lottie */
	animationData: object;
	/** Largura do ícone em pixels (padrão: 24) */
	width?: number;
	/** Altura do ícone em pixels (padrão: 24) */
	height?: number;
	/** Classe CSS customizada para o container */
	className?: string;
	/** Classe CSS customizada para o LottieAnimation (ex: "h-10") */
	animationClassName?: string;
	/** Se o ícone está em estado de hover (controlado pelo pai) */
	isHovering?: boolean;
}

/**
 * Componente que renderiza um ícone Lottie com animação ao hover
 * O estado de hover é controlado pelo componente pai
 * Quando isHovering muda para true, a animação começa do zero
 *
 * @example
 * <HoverLottieIcon
 *   animationData={searchAnimation}
 *   width={24}
 *   height={24}
 *   isHovering={isButtonHovering}
 * />
 */
export const HoverLottieIcon = React.forwardRef<HTMLDivElement, HoverLottieIconProps>(
	(
		{
			animationData,
			width = 24,
			height = 24,
			className = "",
			animationClassName = "",
			isHovering = false,
		},
		ref
	) => {
		// Usar uma chave para forçar remontagem quando hover começa
		// Isso garante que a animação sempre comece do zero
		const mountKey = isHovering ? "playing" : "paused";

		return (
			<div
				ref={ref}
				className={className}
				style={{
					width: width,
					height: height,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{isHovering ? (
					<LottieAnimation
						key={`${mountKey}-${Date.now()}`}
						animationData={animationData}
						width={width}
						height={height}
						asIcon
						autoplay={true}
						loop={false}
						isPaused={false}
						className={animationClassName}
					/>
				) : (
					<LottieAnimation
						key={mountKey}
						animationData={animationData}
						width={width}
						height={height}
						asIcon
						autoplay={false}
						loop={false}
						isPaused={true}
						className={animationClassName}
					/>
				)}
			</div>
		);
	}
);

HoverLottieIcon.displayName = "HoverLottieIcon";
