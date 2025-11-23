'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

const TermosCondicoes = () => {
	return (
		<div className="min-h-screen flex flex-col">
		{/* Header */}
		<header className="p-4">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-3xl font-bold">Legislaí.</h1>
				<div className="flex items-center space-x-4">
					<Link href="/login">
						<Button size="lg" variant="limanjar" className="cursor-pointer">
							Entrar
						</Button>
					</Link>
				</div>
			</div>
		</header>

		{/* Conteúdo Principal */}
		<main className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold mb-2">Termos e Condições de Uso</h1>
					<p className="text-gray-600 mb-2">Legislaí — Plataforma de Participação Legislativa</p>
					<p className="text-sm text-gray-500 mb-8">Atualizado em: 23 de novembro de 2025</p>

					<div className="space-y-6 text-black-700 leading-relaxed">

						<section>
							<h2 className="text-2xl font-bold mb-3">1. Definições</h2>
							<p>Plataforma: Sistema digital Legislaí para participação legislativa, consulta mediada por IA, votações e denúncias.</p>
							<p>Usuário: Pessoa que acessa e usa a Plataforma.</p>
							<p>IA: Módulos automatizados para análise legislativa, interpretação técnica e recomendações.</p>
							<p>Métricas: Cálculos numéricos de Reputação (credibilidade) e Relevância (engajamento/impacto).</p>
							<p>Dados Pessoais: Informações que identificam o usuário, conforme LGPD.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">2. Objeto e Aceitação</h2>
							<p>Estes Termos regulam acesso e uso da Plataforma. Ao acessar, você aceita integralmente este documento e a Política de Privacidade complementar. Se não concordar, não use o sistema.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">3. Funcionalidades</h2>
							<p>Acompanhamento de Notícias: Acesso a notícias sobre legislação local.</p>
							<p>Consulta Legislativa com IA: Busca de textos legislativos com análise técnica automatizada. A IA pode conter imprecisões e não substitui profissionais jurídicos.</p>
							<p>Votações: Participação em votações sobre propostas legislativas.</p>
							<p>Denúncias: Reporte de problemas locais estruturados e públicos.</p>
							<p>Métricas: Pontuação automática de Reputação e Relevância que afeta visibilidade e ordenação de conteúdo.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">4. Cadastro e Acesso</h2>
							<p>O usuário deve ter 18+ anos e fornecer informações verdadeiras. A Plataforma pode recusar, suspender ou banir contas sem aviso prévio por violações de termos ou comportamento suspeito. Você é responsável pela segurança de sua senha. Usuários não autenticados podem acessar conteúdo público, mas não podem criar, votar ou participar.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">5. Direitos do Usuário</h2>
							<p>Você tem direito a: acessar a Plataforma, receber informações sobre funcionamento, contestar decisões automatizadas, solicitar exclusão de conta e dados, portabilidade de dados, correção de informações imprecisas e acesso a logs de atividade.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">6. Proibições</h2>
							<p>É proibido: atividades ilegais, assédio, spam, difamação, manipulação de métricas, engenharia reversa, ataques técnicos, impersonação, violação de privacidade e conteúdo comercial não autorizado.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">7. Limitações da IA</h2>
							<p>A IA fornece análises automatizadas mas pode conter erros, imprecisões, interpretações incompletas ou vieses. Não substitui profissionais jurídicos. Use para contextualização apenas. Algoritmos podem ser atualizados sem aviso prévio.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">8. Métricas de Reputação e Relevância</h2>
							<p>Reputação: Mede credibilidade derivada de comportamento e histórico.</p>
							<p>Relevância: Mede engajamento e qualidade de contribuições.</p>
							<p>Ambas são calculadas automaticamente por algoritmos. É proibido manipulação artificial. Violações resultam em rebaixamento, suspensão ou banimento permanente. A Plataforma fornecerá explicações básicas mas não revelará algoritmos exatos.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">9. Propriedade Intelectual</h2>
							<p>Todo design, algoritmos, textos e interfaces são propriedade exclusiva da Plataforma. Você retém direitos sobre conteúdo que cria mas concede licença perpétua à Plataforma para reproduzir, distribuir e adaptar. Engenharia reversa é proibida.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">10. Limitação de Responsabilidade</h2>
							<p>A PLATAFORMA É FORNECIDA "COMO ESTÁ" SEM GARANTIAS. Não garantimos disponibilidade ininterrupta, precisão de dados ou funcionamento perfeito. Não somos responsáveis por: erros de IA, interpretações múltiplas de leis, mau uso, dados de terceiros, falhas de dispositivo do usuário ou danos derivados de confiança em análises. Responsabilidade máxima: R$ 100,00 ou valor pago nos últimos 12 meses, o que for menor.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">11. Moderação e Suspensão</h2>
							<p>A Plataforma pode remover conteúdo, suspender ou banir contas sem aviso prévio. Suspensão temporária por primeira violação (48 horas a 30 dias). Banimento permanente por violações severas, atividades ilegais, assédio persistente, manipulação sistemática ou ataques técnicos. Você pode contestar dentro de 7 dias. Após suspensão, dados podem ser retidos, anonimizados ou mantidos por segurança.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">12. Privacidade e Dados</h2>
							<p>Coleta, processamento e proteção de dados seguem a Política de Privacidade complementar e LGPD. Recomendamos leitura integral da Política.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">13. Decisões Automatizadas (LGPD Art. 22)</h2>
							<p>A Plataforma utiliza sistemas automatizados para decisões que afetam você (cálculo de métricas, moderação, priorização). Você tem direito a: contestação, revisão humana, explicação sobre decisões e, em certos casos, oposição a processamento singular. Solicite enviando email para privacy@legislai.com.br. Responderemos em 30 dias.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">14. Uso Aceitável</h2>
							<p>Permitido: Conteúdo relevante, respeitoso, factualmente preciso ou claramente opinativo, sem violação de direitos de terceiros.</p>
							<p>Proibido: Violações legais, assédio, ameaças, spam, malware, phishing, conteúdo sexual envolvendo menores, doxing, desinformação sobre eleições.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">15. Alterações dos Termos</h2>
							<p>Podemos atualizar estes Termos periodicamente. Mudanças substanciais serão comunicadas por banner ou email. Uso contínuo implica aceitação. Se não concordar, cesse o uso imediatamente.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">16. Indenização</h2>
							<p>Você indeniza a Plataforma e seus funcionários contra reclamações, perdas ou danos resultantes de: sua violação destes Termos, violação de direitos de terceiros, conteúdo que cria ou compartilha, ou mau uso da Plataforma.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">17. Jurisdição</h2>
							<p>Lei brasileira aplicável. Jurisdição exclusiva dos tribunais brasileiros. Antes de ação judicial, tentaremos resolver por contato direto e negociação. Qualquer reclamação deve ser ajuizada em até 1 ano após conhecimento do dano.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">18. Contato</h2>
							<p>Email: legal@legislai.com.br</p>
							<p>Última atualização: 23 de novembro de 2025 | Versão 1.0</p>
						</section>

					</div>
				</div>

				<div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
					<p className="text-center text-gray-600">
						<Link href="/politica-privacidade" className="underline hover:text-gray-900">
							Política de Privacidade
						</Link>
						{' | '}
						<Link href="/termos-condicoes" className="underline hover:text-gray-900">
							Termos e Condições
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
};

export default TermosCondicoes;
