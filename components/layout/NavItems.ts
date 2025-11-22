import newsPaperAnimation from "@/lotties/Newspaper.json";
import searchAnimation from "@/lotties/Search.json";
import mapAnimation from "@/lotties/Map.json";
import calendarAnimation from "@/lotties/Calendar.json";
import learnAnimation from "@/lotties/Learn.json";

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
		lottieAnimation: newsPaperAnimation,
		animateOnHover: true,
		href: "/noticias",
		activeVariant: "limanjar",
	},
	{
		id: "pesquisa",
		label: "Pesquisa",
		lottieAnimation: searchAnimation,
		animateOnHover: true,
		href: "/pesquisa",
		activeVariant: "limanjar",
	},
	{
		id: "mapa-de-denuncias",
		label: "Mapa de denúncias",
		lottieAnimation: mapAnimation,
		animateOnHover: true,
		animationClassName: "h-10! -translate-y-[2px] scale-95!",
		href: "/mapa-de-denuncias",
		activeVariant: "limanjar",
	},
	{
		id: "calendario-legislativo",
		label: "Calendário Legislativo",
		lottieAnimation: calendarAnimation,
		animateOnHover: true,
		href: "/calendario-legislativo",
		activeVariant: "limanjar",
	},
	{
		id: "educacao",
		label: "Educação",
		lottieAnimation: learnAnimation,
		animateOnHover: true,
		href: "/educacao",
		activeVariant: "limanjar",
	},
];
