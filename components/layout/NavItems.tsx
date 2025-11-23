"use client";

import { animations } from "./animations";

export interface NavItem {
	id: string;
	label: string;
	iconName?: string;
	href: string;
	activeVariant: string;
	lottieAnimation?: object;
	animateOnHover?: boolean;
	animationClassName?: string;
}

export const navItems: NavItem[] = [
	{
		id: "noticias",
		label: "Notícias",
		lottieAnimation: animations.newspaper,
		animateOnHover: true,
		href: "/noticias",
		activeVariant: "limanjar",
	},
	{
		id: "pesquisa-legislativa",
		label: "Pesquisa Legislativa",
		lottieAnimation: animations.search,
		animateOnHover: true,
		href: "/pesquisa-legislativa",
		activeVariant: "limanjar",
	},
	{
		id: "mapa-de-denuncias",
		label: "Mapa de denúncias",
		lottieAnimation: animations.map,
		animateOnHover: true,
		animationClassName: "h-10! -translate-y-[2px] scale-95!",
		href: "/mapa-de-denuncias",
		activeVariant: "limanjar",
	},
	{
		id: "calendario-legislativo",
		label: "Calendário Legislativo",
		lottieAnimation: animations.calendar,
		animateOnHover: true,
		href: "/calendario-legislativo",
		activeVariant: "limanjar",
	},
	{
		id: "educacao",
		label: "Educação",
		lottieAnimation: animations.learn,
		animateOnHover: true,
		href: "/educacao",
		activeVariant: "limanjar",
	},
];
