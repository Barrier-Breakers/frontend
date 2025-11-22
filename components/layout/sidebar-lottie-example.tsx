/**
 * EXEMPLO DE INTEGRAÇÃO: ÍCONES LOTTIE NO SIDEBAR
 *
 * Este arquivo mostra como integrar ícones Lottie animáveis ao hover
 * no Sidebar da aplicação.
 */

"use client";

import { useLottieAnimation } from "@/hooks/useLottieAnimation";
import { SidebarContent } from "@/components/layout/SidebarContent";

// Exemplo 1: Usando com importação direta
// ==========================================
// Primeiro, baixe os JSONs do Lottie Files e coloque em /public/lotties/
// Depois importe assim:

// import searchAnimation from "@/lotties/search.json";
// import noticiasAnimation from "@/lotties/noticias.json";

// Exemplo 2: Usando com carregamento dinâmico (RECOMENDADO)
// ===========================================================

export function SidebarWithLottieIconsExample() {
	// Carrega as animações dinamicamente
	const { animationData: searchAnim } = useLottieAnimation("/lotties/search.json");
	const { animationData: noticiasAnim } = useLottieAnimation("/lotties/noticias.json");
	const { animationData: mapaAnim } = useLottieAnimation("/lotties/mapa.json");
	const { animationData: calendarAnim } = useLottieAnimation("/lotties/calendario.json");
	const { animationData: educacaoAnim } = useLottieAnimation("/lotties/educacao.json");

	return <SidebarContent />;
}

// Exemplo 3: Como modificar o NavItems para usar ícones Lottie
// =============================================================
/*
Edite o arquivo components/layout/NavItems.ts assim:

```typescript
import searchAnimation from "@/lotties/search.json";
import noticiasAnimation from "@/lotties/noticias.json";

export interface NavItem {
	id: string;
	label: string;
	iconName?: string; // Agora opcional
	href: string;
	activeVariant: string;
	lottieAnimation?: object; // Novo campo
	animateOnHover?: boolean; // Novo campo
}

export const navItems: NavItem[] = [
	{
		id: "noticias",
		label: "Notícias",
		lottieAnimation: noticiasAnimation,
		animateOnHover: true, // Anima ao hover!
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
	// ... resto dos itens
];
```

Exemplo 4: Como usar no SidebarContent
========================================

Modifique o arquivo components/layout/SidebarContent.tsx assim:

```tsx
{navItems.map((item) => {
	const active = isActive(item.href);
	return (
		<Link
			key={item.id}
			href={item.href}
			onClick={isMobile ? onCloseMobile : undefined}
			className="no-underline!"
		>
			<Button
				variant={active ? (item.activeVariant as any) : "nevasca"}
				size="lg"
				className="h-14 cursor-pointer w-full flex justify-start gap-4 p-4"
			>
				<div className="flex-shrink-0 flex items-center justify-center w-5">
					<IconRenderer
						iconName={item.iconName}
						lottieAnimation={item.lottieAnimation}
						animateOnHover={item.animateOnHover}
					/>
				</div>
				{(isExpanded || isMobile) && (
					<span className="text-[1.08rem] font-semibold whitespace-nowrap overflow-hidden">
						{item.label}
					</span>
				)}
			</Button>
		</Link>
	);
})}
```
*/

// ESTRUTURA RECOMENDADA DE PASTAS
// ================================
/*
/public/lotties/
  ├── search.json (ícone de pesquisa)
  ├── noticias.json (ícone de notícias)
  ├── mapa.json (ícone de mapa de denúncias)
  ├── calendario.json (ícone de calendário legislativo)
  └── educacao.json (ícone de educação)

Cada JSON deve ser uma animação simples que cabe bem em 24x24px
Recomenda-se usar animações rápidas (0.5-1 segundo) para melhor UX
*/

// COMO FUNCIONA A ANIMAÇÃO AO HOVER
// ==================================
/*
1. O usuário aproxima o mouse do botão
2. onMouseEnter é disparado
3. A animação começa a tocar (isPaused = false)
4. O usuário afasta o mouse
5. onMouseLeave é disparado
6. A animação é pausada (isPaused = true)

A animação só toca UMA VEZ por hover (loop={false})
É muito rápido e responsivo!
*/
