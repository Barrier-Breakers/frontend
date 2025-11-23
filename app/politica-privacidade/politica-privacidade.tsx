'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

const PoliticaPrivacidade = () => {
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
					<h1 className="text-4xl font-bold mb-2">Política de Privacidade</h1>
					<p className="text-gray-600 mb-2">Como protegemos seus dados conforme a LGPD</p>
					<p className="text-sm text-gray-500 mb-8">Atualizado em: 23 de novembro de 2025</p>

					<div className="space-y-6 text-black-700 leading-relaxed">

						<section>
							<h2 className="text-2xl font-bold mb-3">Introdução</h2>
							<p>A Plataforma Legislaí respeita sua privacidade e está comprometida com proteção de dados conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Esta política descreve como coletamos, processamos, armazenamos, protegemos e utilizamos suas informações. Leia cuidadosamente. Se não concordar, não use a Plataforma.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">1. Quais Dados Coletamos</h2>
							<p>Cadastro: Nome, email, password (hash), data de nascimento, telefone (opcional), CEP/localização, foto e bio de perfil.</p>
							<p>Atividade: Histórico de denúncias, votações, comentários, pesquisas, páginas visitadas, tempo de permanência, conteúdos salvos, interações com usuários e horário das atividades.</p>
							<p>Técnico: IP, navegador, sistema operacional, tipo de dispositivo, idioma, geolocalização (se permitida), cookies, device IDs, velocidade de conexão e user-agent.</p>
							<p>Para IA e Métricas: Qualidade de conteúdo, padrões de votação, engajamento, histórico de comportamento, dados agregados de múltiplos usuários.</p>
							<p>De Terceiros: Dados públicos de redes sociais (se vinculadas), denúncias de outros usuários, informações de autenticação externa (Google, Facebook), dados de segurança e detecção de fraude.</p>
							<p>O que NÃO coletamos: Não coletamos intencionalmente: dados de origem racial/étnica, filiação política direta, saúde, dados genéticos, biométricos, vida sexual, ou religião. Se compartilhar voluntariamente em conteúdo público, processaremos conforme descrito.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">2. Como Coletamos</h2>
							<p>Coleta Direta: Você fornece em formulários, perfil e denúncias.</p>
							<p>Coleta Automática: Via cookies, pixels, logs de servidor e análise de comportamento.</p>
							<p>Cookies: Mantemos sessão autenticada, lembramos preferências, analisamos uso, prevenimos fraude e personalizamos recomendações. Você pode gerenciar no navegador.</p>
							<p>Web Beacons: Pequenos arquivos rastreiam visualizações e engajamento.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">3. Base Legal (LGPD)</h2>
							<p>Consentimento (Art. 7, I): Dados de cadastro, perfil e conteúdo. Você fornece ativamente ao aceitar Termos. Revogue solicitando exclusão.</p>
							<p>Legítimo Interesse (Art. 7, IX): Dados técnicos, cookies, comportamento, detecção de fraude. Interesse legítimo: segurança, melhoria de funcionalidades, análise. Você pode se opor.</p>
							<p>Obrigação Legal (Art. 7, II): Dados para cumprimento de leis, ordens judiciais, investigações criminais.</p>
							<p>Execução de Contrato (Art. 7, V): Dados necessários para fornecer funcionalidades (email para notificações, localização para contexto).</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">4. Como Usamos Seus Dados</h2>
							<p>Operação: Autenticação, fornecimento de funcionalidades, notificações, relatórios pessoais.</p>
							<p>IA e Análises: Análise legislativa, sugestões de legislação, análise de sentimento, detecção de similaridade, insights agregados.</p>
							<p>Cálculo de Métricas: Reputação (credibilidade), Relevância (engajamento), ordenação de conteúdo, visibilidade, priorização de denúncias, moderação automática.</p>
							<p>Segurança e Conformidade: Detecção de fraude, investigação de violações, proteção contra ataques, conformidade legal, auditoria e resposta a incidentes.</p>
							<p>Melhorias: Análise agregada de uso, identificação de problemas, pesquisa de usabilidade, testes A/B, estudos sobre participação cívica (dados anonimizados).</p>
							<p>O que NÃO fazemos: Não vendemos dados. Não compartilhamos com anunciantes. Não usamos para marketing de terceiros. Não discriminamos ou tomamos decisões prejudiciais sem consentimento.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">5. IA e Processamento Automatizado</h2>
							<p>Análise Legislativa: Suas pesquisas, votações e conteúdo são processados para análise técnica, recomendações e identificação de padrões comunitários.</p>
							<p>Detecção de Fraude: IA analisa padrões para detectar múltiplas contas, votações falsas, spam, manipulação de métricas, atividade maliciosa.</p>
							<p>Direitos (LGPD Art. 22): Você tem direito a contestação, revisão humana, explicação sobre decisões automatizadas e, em certos casos, oposição a processamento singular. Solicite em privacy@legislai.com.br.</p>
							<p>Treinamento de IA: Conteúdo público (denúncias, comentários), dados agregados e anonimizados são utilizados. Você pode solicitar exclusão de conteúdo específico.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">6. Compartilhamento de Dados</h2>
							<p>Público: Conteúdo que marca como público é visível para todos. Seu perfil público inclui nome e métrica de reputação.</p>
							<p>Funcionários e Contratados: Acesso conforme necessário para operação, suporte, moderação, conformidade, análise. Todos assinam confidencialidade.</p>
							<p>Terceirizados: Hospedagem (AWS, Google Cloud), email, analytics, segurança, detecção de fraude, pagamento (se aplicável). Assinamos Data Processing Agreements (DPA).</p>
							<p>Autoridades Legais: Compartilhamos quando obrigados por mandado, investigação criminal, exigência legal ou proteção de direitos/segurança. Tentaremos notificá-lo exceto se proibido.</p>
							<p>O que NÃO fazemos: Não vendemos. Não compartilhamos para marketing. Não transferimos sem transparência. Não fazemos fusões sem comunicação.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">7. Armazenamento e Retenção</h2>
							<p>Localização: Dados armazenados no Brasil (LGPD Art. 33). Backup em múltiplos locais. Encriptação em trânsito (HTTPS/TLS) e repouso (AES-256).</p>
							<p>Prazos: Conta ativa: enquanto ativa. Após exclusão: 90 dias (soft delete para recuperação). Obrigação legal: 6 meses a 3 anos mínimo. Logs de segurança: 1 ano. Dados públicos: indefinidamente como referência histórica.</p>
							<p>Exclusão Segura: Deletados com protocolo seguro. Backups antigos sobrescritos. Terceiros notificados. Verificação documentada.</p>
							<p>Dados Anonimizados: Indefinidamente para pesquisa e melhoria de IA.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">8. Segurança</h2>
							<p>Técnica: HTTPS/TLS em trânsito, AES-256 em repouso, senhas hash (bcrypt), autenticação multi-fator (MFA) opcional, firewalls, detecção de invasão, proteção DDoS, Web Application Firewall (WAF).</p>
							<p>Administrativa: Controle de acesso restrito, acordos de confidencialidade, segregação de ambientes, auditorias regulares, treinamento de funcionários.</p>
							<p>Física: Data centers seguros com acesso controlado, vigilância 24/7, proteção ambiental, destruição segura de equipamentos.</p>
							<p>Limitação: Nenhum sistema é 100% seguro. Se suspeitar de comprometimento, notifique-nos imediatamente.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">9. Seus Direitos LGPD</h2>
							<p>Acesso (Art. 17): Solicite cópia de todos seus dados. Resposta: 30 dias. Email: privacy@legislai.com.br.</p>
							<p>Correção (Art. 19): Corrija dados incompletos ou imprecisos. Muitos dados podem ser corrigidos no perfil.</p>
							<p>Exclusão (Art. 17, §2): Solicite exclusão em certas circunstâncias: fins cumpridos, revogação de consentimento, obtenção ilícita, exigência legal. Exceção: retenção legal ou segurança.</p>
							<p>Portabilidade (Art. 20): Receba dados em formato estruturado (JSON, CSV). Transfera para outro serviço.</p>
							<p>Oposição (Art. 21): Se dados processados por legítimo interesse, oponha-se. Podemos continuar se há motivo preponderante.</p>
							<p>Revogação: Revogue consentimento a qualquer tempo. Gerencie via configurações ou email.</p>
							<p>Não Ser Sujeito a Decisão Singular (Art. 22): Direito a revisão manual de decisões automatizadas que prejudiquem significativamente.</p>
							<p>Como Exercer: Email privacy@legislai.com.br, formulário nas configurações. Forneça email/ID e descrição clara. Gratuito.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">10. Incidentes de Segurança</h2>
							<p>Se Ocorrer Brecha: Investigamos imediatamente, isolamos sistemas, documentamos, notificamos você (se lei exigir), notificamos autoridades (se necessário), implementamos correções.</p>
							<p>Notificação: Dentro de 72 horas (LGPD Art. 33) via email e notificação na Plataforma. Incluímos: descrição da brecha, dados afetados, medidas tomadas, recomendações.</p>
							<p>Reporte de Vulnerabilidades: Envie para security@legislai.com.br. Não divulgue antes da correção. Agradecemos pesquisadores responsáveis.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">11. Cookies e Rastreamento</h2>
							<p>Tipos: Essenciais (autenticação, segurança, funcionalidades básicas - obrigatório). Preferências (tema, idioma, layout). Performance (análise, detecção de problemas). Analytics (Google Analytics). Marketing (remarketing, conversão - se habilitado).</p>
							<p>Gerenciamento: Banner de consentimento na primeira visita. Controle via navegador (pode afetar funcionalidades).</p>
							<p>Terceiros: Google Analytics, redes sociais (se vinculadas), prestadores de serviço. Você controla via configurações de navegador.</p>
							<p>Web Beacons: Rastreiam visualizações e engajamento de emails. Desabilite carregamento de imagens no cliente de email para evitar.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">12. Transferência Internacional</h2>
							<p>Padrão: Dados armazenados exclusivamente no Brasil (LGPD Art. 33).</p>
							<p>Exceções: Transferência apenas com consentimento explícito, país receptor com proteção adequada ou mecanismo aprovado (Cláusulas Contratuais Padrão), exigência legal. Comunicação prévia.</p>
							<p>Prestadores Internacionais: Data Processing Agreements (DPA), conformidade com LGPD, transferências documentadas.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">13. Proteção de Menores</h2>
							<p>Plataforma é para maiores de 18 anos. Não coletamos intencionalmente dados de menores. Se descobrirmos, excluímos imediatamente. Se responsável souber de acesso não autorizado, contate privacy@legislai.com.br.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">14. Alterações da Política</h2>
							<p>Podemos atualizar periodicamente. Mudanças significativas comunicadas por banner ou email. Uso contínuo implica aceitação. Revise periodicamente.</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-3">15. Contato</h2>
							<p>Dúvidas: privacy@legislai.com.br (resposta em 30 dias).</p>
							<p>Direitos LGPD: privacy@legislai.com.br com descrição clara.</p>
							<p>Brechas de Segurança: security@legislai.com.br.</p>
							<p>Reclamação à ANPD: Se insatisfeito com resposta. ANPD - Autoridade Nacional de Proteção de Dados. www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd | ouvidoria@anpd.gov.br</p>
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

export default PoliticaPrivacidade;
