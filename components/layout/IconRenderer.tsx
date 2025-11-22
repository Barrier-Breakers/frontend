"use client";

import React from "react";
import {
	Home,
	MapPin,
	Users,
	Settings,
	LucideIcon,
	Search,
	Newspaper,
	Map,
	GraduationCap,
	Calendar,
} from "lucide-react";
import { HoverLottieIcon } from "@/components/ui/hover-lottie-icon";

const iconMap: Record<string, LucideIcon> = {
	Home,
	MapPin,
	Users,
	Settings,
	Search,
	Newspaper,
	Map,
	GraduationCap,
	Calendar,
};

export interface IconRendererProps {
	iconName: string;
	size?: number;
	/**
	 * Se o ícone é um Lottie animation, passar o objeto de animação aqui
	 * Se passar um lottieAnimation, o iconName será ignorado
	 */
	lottieAnimation?: object;
	/**
	 * Se true e lottieAnimation for passado, o ícone animará ao hover
	 */
	animateOnHover?: boolean;
	/**
	 * Se o componente pai está em estado de hover (controlado pelo pai)
	 */
	isHovering?: boolean;
	/**
	 * Classe CSS customizada para o LottieAnimation (ex: "h-10" para icons maiores)
	 */
	animationClassName?: string;
}

/**
 * Renderiza ícones Lucide ou Lottie
 * Suporta animação ao hover para ícones Lottie
 */
export function IconRenderer({
	iconName,
	size = 40,
	lottieAnimation,
	animateOnHover = false,
	isHovering = false,
	animationClassName = "",
}: IconRendererProps) {
	// Se for um ícone Lottie com animação ao hover
	if (lottieAnimation && animateOnHover) {
		return (
			<HoverLottieIcon
				animationData={lottieAnimation}
				width={24}
				height={24}
				className="w-6 h-6"
				animationClassName={animationClassName}
				isHovering={isHovering}
			/>
		);
	}

	// Se for um ícone Lottie sem animação ao hover (animação contínua)
	if (lottieAnimation) {
		const {
			LottieAnimation: LottieAnimationComponent,
		} = require("@/components/ui/lottie-animation");
		return (
			<LottieAnimationComponent
				animationData={lottieAnimation}
				width={24}
				height={24}
				asIcon
				autoplay={true}
				loop={true}
				className={animationClassName}
			/>
		);
	}

	// Se for um ícone Lucide
	const Icon = iconMap[iconName];
	if (!Icon) return null;
	return <Icon size={size} className="w-6! h-6! stroke-[2.5px]" />;
}
