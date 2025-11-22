export interface NavItem {
	id: string;
	label: string;
	iconName: string;
	href: string;
	activeVariant: string;
}

export const navItems: NavItem[] = [
	{
		id: "noticias",
		label: "Notícias",
		iconName: "Newspaper",
		href: "/noticias",
		activeVariant: "limanjar",
	},
	{
		id: "pesquisa",
		label: "Pesquisa",
		iconName: "Search",
		href: "/pesquisa",
		activeVariant: "limanjar",
	},
	{
		id: "mapa-de-denuncias",
		label: "Mapa de denúncias",
		iconName: "Map",
		href: "/mapa-de-denuncias",
		activeVariant: "limanjar",
	},
	{
		id: "calendario-legislativo",
		label: "Calendário Legislativo",
		iconName: "Calendar",
		href: "/calendario-legislativo",
		activeVariant: "limanjar",
	},
	{
		id: "educacao",
		label: "Educação",
		iconName: "GraduationCap",
		href: "/educacao",
		activeVariant: "limanjar",
	},
];
