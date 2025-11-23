'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PageTitle } from '@/components/layout/PageTitle';
import {
	Phone,
	MapPin,
	Globe,
	Mail,
	ChevronDown,
	Search,
	AlertCircle,
	Heart,
	Shield,
	DollarSign,
	Users,
	CheckCircle,
	ArrowRight,
	ExternalLink,
	Copy,
	Check,
	ChevronRight,
	Github,
} from 'lucide-react';

import Link from 'next/link';
import Footer from '@/components/Footer';
import { REGIONS_DATA, type Region, type Entry, type Contact } from '@/lib/links-uteis-data';


// TIPOS E DADOS
// Tipos importados de @/lib/links-uteis-data


// Mapa de cores por tipo
const TYPE_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
	emergência: { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle className="w-4 h-4" /> },
	polícia: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Shield className="w-4 h-4" /> },
	saúde: { bg: 'bg-green-100', text: 'text-green-700', icon: <Heart className="w-4 h-4" /> },
	fogo: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <AlertCircle className="w-4 h-4" /> },
	aconselhamento: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Users className="w-4 h-4" /> },
	direitos_humanos: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <CheckCircle className="w-4 h-4" /> },
	violência_contra_mulher: { bg: 'bg-pink-100', text: 'text-pink-700', icon: <Heart className="w-4 h-4" /> },
	proteção_a_criança: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Shield className="w-4 h-4" /> },
	transparência: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: <Globe className="w-4 h-4" /> },
	legislativo: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <Users className="w-4 h-4" /> },
	eleitoral: { bg: 'bg-violet-100', text: 'text-violet-700', icon: <CheckCircle className="w-4 h-4" /> },
	proteção_ao_consumidor: { bg: 'bg-lime-100', text: 'text-lime-700', icon: <DollarSign className="w-4 h-4" /> },
	ouvidoria: { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Users className="w-4 h-4" /> },
	participação: { bg: 'bg-teal-100', text: 'text-teal-700', icon: <Users className="w-4 h-4" /> },
};

// COMPONENTES

const EntryCard = ({ entry }: { entry: Entry }) => {
	const [copied, setCopied] = useState(false);
	const typeStyle = TYPE_COLORS[entry.type] || TYPE_COLORS.ouvidoria;

	const handleCopyPhone = () => {
		if (entry.contact.phone) {
			navigator.clipboard.writeText(entry.contact.phone);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
			<Card className="cardoso border-2 border-black p-4 gap-3 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all h-full">
				<div className="flex items-start justify-between gap-2">
					<div className={cn('px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold', typeStyle.bg, typeStyle.text)}>
						{typeStyle.icon}
						{entry.type.replace(/_/g, ' ')}
					</div>
				</div>

				<h3 className="text-lg font-bold">{entry.title}</h3>
				<p className="text-sm text-gray-600 leading-relaxed">{entry.description}</p>

				<div className="space-y-2">
					{entry.contact.phone && (
						<div className="flex items-center gap-2 text-sm font-semibold">
							<Phone className="w-4 h-4" />
							<a href={entry.contact.phoneClick} className="text-blue-600 hover:underline">
								{entry.contact.phone}
							</a>
							<button onClick={handleCopyPhone} className="ml-auto p-1 hover:bg-gray-100 rounded">
								{copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
							</button>
						</div>
					)}
					{entry.contact.email && (
						<div className="flex items-center gap-2 text-sm font-semibold">
							<Mail className="w-4 h-4" />
							<a href={`mailto:${entry.contact.email}`} className="text-blue-600 hover:underline">
								{entry.contact.email}
							</a>
						</div>
					)}
					{entry.contact.url && (
						<div className="flex items-center gap-2 text-sm font-semibold">
							<Globe className="w-4 h-4" />
							<a href={entry.contact.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
								Acessar portal
								<ExternalLink className="w-3 h-3 inline ml-1" />
							</a>
						</div>
					)}
				</div>

				{entry.notes && <p className="text-xs text-gray-500 italic border-t border-gray-200 pt-2">{entry.notes}</p>}
			</Card>
		</motion.div>
	);
};

const RegionSection = ({ region, isExpanded, onToggle }: { region: Region; isExpanded: boolean; onToggle: () => void }) => {
	return (
		<div className="space-y-3">
			<motion.button
				onClick={onToggle}
				className="w-full flex items-center justify-between p-4 bg-white border-2 border-black rounded-lg hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all"
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
			>
				<div className="flex items-center gap-3">
					<MapPin className="w-5 h-5" />
					<div className="text-left">
						<p className="font-bold text-lg">{region.name}</p>
						<p className="text-sm text-gray-600">{region.entries.length} links úteis</p>
					</div>
				</div>
				<motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
					<ChevronDown className="w-5 h-5" />
				</motion.div>
			</motion.button>

			<AnimatePresence>
				{isExpanded && (
					<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
						{region.entries.map((entry) => (
							<EntryCard key={entry.id} entry={entry} />
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

// PÁGINA PRINCIPAL

export default function LinksUteisPage() {
	const [expandedRegions, setExpandedRegions] = useState<string[]>(['Brasil']);
	const [searchQuery, setSearchQuery] = useState('');

	const filteredRegions = useMemo(() => {
		return REGIONS_DATA.map((region) => ({
			...region,
			entries: region.entries.filter((entry) => {
				const query = searchQuery.toLowerCase();
				return (
					entry.title.toLowerCase().includes(query) ||
					entry.description.toLowerCase().includes(query) ||
					entry.tags.some((tag) => tag.toLowerCase().includes(query)) ||
					entry.contact.phone?.includes(query)
				);
			}),
		})).filter((region) => region.entries.length > 0 || expandedRegions.includes(region.name));
	}, [searchQuery, expandedRegions]);

	const toggleRegion = (regionName: string) => {
		setExpandedRegions((prev) =>
			prev.includes(regionName) ? prev.filter((r) => r !== regionName) : [...prev, regionName]
		);
	};

	return (
		<>
			{/* Page Title */}
			<PageTitle
				title="Links Úteis"
				description="Encontre números de emergência, órgãos públicos e serviços importantes por região."
			/>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-12">
				{/* Search Bar - Design System */}
				<div className="max-w-2xl mx-auto mb-12">
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="relative"
					>
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
						<Input
							type="text"
							placeholder="🔍 Busque por serviço, número ou estado..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-lg text-base font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200"
						/>
					</motion.div>
					<AnimatePresence>
						{searchQuery && (
							<motion.p
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								className="text-sm font-semibold text-black mt-3 flex items-center gap-2"
							>
								<CheckCircle className="w-4 h-4 text-green-600" />
								Mostrando resultados para: <span className="limanjar px-2 py-1 rounded-md">"{searchQuery}"</span>
							</motion.p>
						)}
					</AnimatePresence>
				</div>

				{/* Quick Access emergência Numbers */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
					<Button
						variant="limanjar"
						size="lg"
						className="h-auto py-4 flex flex-col items-start justify-start"
						asChild
					>
						<a href="tel:190">
							<Phone className="w-6 h-6 mb-2" />
							<span className="font-bold text-lg">190</span>
							<span className="text-xs">Polícia</span>
						</a>
					</Button>
					<Button
						variant="mexerica"
						size="lg"
						className="h-auto py-4 flex flex-col items-start justify-start"
						asChild
					>
						<a href="tel:192">
							<Heart className="w-6 h-6 mb-2" />
							<span className="font-bold text-lg">192</span>
							<span className="text-xs">SAMU</span>
						</a>
					</Button>
					<Button
						variant="chicletim"
						size="lg"
						className="h-auto py-4 flex flex-col items-start justify-start"
						asChild
					>
						<a href="tel:193">
							<AlertCircle className="w-6 h-6 mb-2" />
							<span className="font-bold text-lg">193</span>
							<span className="text-xs">Bombeiros</span>
						</a>
					</Button>
					<Button
						variant="frambos"
						size="lg"
						className="h-auto py-4 flex flex-col items-start justify-start"
						asChild
					>
						<a href="tel:100">
							<Shield className="w-6 h-6 mb-2" />
							<span className="font-bold text-lg">100</span>
							<span className="text-xs">Direitos</span>
						</a>
					</Button>
				</div>

				{/* Regions */}
				<div className="space-y-6 max-w-6xl mx-auto">
					{filteredRegions.map((region) => (
						<RegionSection
							key={region.name}
							region={region}
							isExpanded={expandedRegions.includes(region.name)}
							onToggle={() => toggleRegion(region.name)}
						/>
					))}

					{filteredRegions.length === 0 && (
						<div className="text-center py-12">
							<p className="text-lg text-gray-600">Nenhum resultado encontrado para "{searchQuery}"</p>
							<button
								onClick={() => setSearchQuery('')}
								className="text-blue-600 hover:underline font-semibold mt-2"
							>
								Limpar busca
							</button>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
