# Legislaí — Frontend

Versão frontend do projeto Legislaí: app React/Next.js para apoio à participação cívica — denúncias geolocalizadas, acompanhamento de proposições legislativas, notícias e links úteis.

Este repositório contém a interface do usuário (Next.js 16 + App Router) com integração para Mapbox, Lottie (animações), e um pequeno design system baseado em Tailwind + Radix UI.

---

## Tecnologias principais
- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS
- mapbox-gl & @mapbox/search-js-react
- Lottie (react-lottie) + animações JSON em `lotties/`
- Radix UI primitives, framer-motion
- Serviços: `services/api.service.ts`, `services/auth.service.ts`, `services/search.service.ts`

---

## Conteúdo (rápido)
- `app/` — rotas do Next, páginas e APIs (inclui proxies: `app/api/proposicoes/[id]/...`)
- `components/` — componentes de layout, UI e módulos reutilizáveis
- `components/ui/` — primitives (button, input, card, dialog, etc.)
- `hooks/` — hooks customizados (ex.: `useLottieAnimation`, `useProtectedRoute`)
- `services/` — integração com API (auth, search, request wrapper)
- `lotties/` — JSONs de animação Lottie
- `lib/` — utilitários e dados estáticos (`links-uteis-data.ts`)
- `public/` — recursos públicos (imgs, SVGs)

---

## Como rodar (dev)
Requisitos:
- Node 18+ (recomendado)
- pnpm / npm / yarn

1. Instale dependências:
   - `pnpm install` ou `npm install`
2. Crie um `.env.local` (exemplo):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxx...
   ```
   - `NEXT_PUBLIC_API_URL`: URL do backend. Se não definido, muitas páginas usam dados de fallback locais.
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: token público do Mapbox (necessário para map features).
3. Executar em dev:
   - `pnpm dev` ou `npm run dev`
4. Build / start (produção):
   - `pnpm build`
   - `pnpm start`

Comandos úteis:
- `pnpm lint` — rodar eslint
- `pnpm format` — prettier

---

## Observações e comportamento
- Autenticação:
  - `services/auth.service.ts` manipula login, logout, armazenamento de tokens em `localStorage` (`access_token`, `refresh_token`, `token_expires_at`).
  - A página de callback Google (`/auth/callback`) salva tokens vindos do hash da URL.
  - Hook `useProtectedRoute` redireciona usuários não autenticados para `/login`.

- Mapas / Denúncias:
  - Página do mapa: `app/(app)/mapa-de-denuncias/page.tsx`.
  - Requer `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`. Se `NEXT_PUBLIC_API_URL` não estiver configurado, o mapa usa dados gerados localmente como fallback.

- Pesquisa legislativa:
  - `search.service.ts` faz sugestões; se `NEXT_PUBLIC_API_URL` não estiver definido, retorna dados de mock.
  - Detalhes de proposições e simplificação de texto + geração de áudio: `components/pesquisa/ProposicaoDetails.tsx` (trata respostas 200 e 202 e faz polling para áudio).

- Proxies:
  - Rotas em `app/api/proposicoes/[id]/...` fazem proxy para a API pública da Câmara dos Deputados, adicionando cabeçalhos e cache.

- Animações:
  - Lottie animado por hover e componentes `HoverLottieIcon` / `LottieAnimation`.
  - Animações localizadas em `lotties/` e carregadas dinamicamente via `useLottieAnimation`.
