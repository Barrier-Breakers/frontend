"use client";

import { PageTitle } from "@/components/layout/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { Compass, Plus, Minus, ThumbsUp, ThumbsDown } from "lucide-react";

import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { SearchBox } from "@mapbox/search-js-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
import { apiService } from "@/services/api.service";

const generateRandomEvents = (userLat: number, userLng: number) => {
	const randomOffset = () => (Math.random() * 0.005 + 0.0005) * (Math.random() > 0.5 ? 1 : -1);

	const titles = [
		"Corrupção em obra pública",
		"Desvio de verba escolar",
		"Compra superfaturada",
		"Funcionário fantasma",
		"Licitação fraudulenta",
		"Desmatamento ilegal",
		"Poluição industrial",
		"Abuso de poder",
		"Tráfico de influência",
		"Prevaricação",
	];

	const descriptions = [
		"Denúncia de irregularidades em contrato público",
		"Suspeita de desvio de recursos destinados à educação",
		"Compra de materiais com valores acima do mercado",
		"Funcionário que não comparece ao trabalho",
		"Processo licitatório com indícios de fraude",
		"Corte ilegal de árvores em área protegida",
		"Empresa despejando resíduos sem tratamento",
		"Autoridade usando cargo para benefício pessoal",
		"Interferência indevida em processos administrativos",
		"Descumprimento deliberado de deveres funcionais",
	];

	const addresses = [
		"Rua das Flores, Centro",
		"Avenida Brasil, Jardim América",
		"Praça da República, Centro Histórico",
		"Rua São João, Vila Nova",
		"Avenida Paulista, Bela Vista",
		"Rua Augusta, Consolação",
		"Praça Roosevelt, República",
		"Rua Oscar Freire, Jardins",
		"Avenida Rebouças, Pinheiros",
		"Rua da Consolação, Centro",
	];

	const risks = ["alto", "medio", "baixo"];

	const events = [];
	const numEvents = Math.floor(Math.random() * 5) + 8; // 8-12 eventos

	for (let i = 0; i < numEvents; i++) {
		events.push({
			id: i + 1,
			title: titles[Math.floor(Math.random() * titles.length)],
			address: addresses[Math.floor(Math.random() * addresses.length)],
			description: descriptions[Math.floor(Math.random() * descriptions.length)],
			location: {
				latitude: userLat + randomOffset(),
				longitude: userLng + randomOffset(),
			},
			risco: risks[Math.floor(Math.random() * risks.length)],
			votos: Math.floor(Math.random() * 20) + 1,
			upvotes: Math.floor(Math.random() * 20) + 1,
			downvotes: Math.floor(Math.random() * 10),
			medias: [],
			comentarios: [],
		});
	}

	return events;
};

export default function MapaDenunciasPage() {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
	const eventMarkersRef = useRef<mapboxgl.Marker[]>([]);
	const mapInitializedRef = useRef(false);
	const userLocationUsedRef = useRef(false);
	const activeMarkerRef = useRef<{
		marker: mapboxgl.Marker;
		event: (typeof dynamicEvents)[0];
		element: HTMLElement;
	} | null>(null);

	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [dynamicEvents, setDynamicEvents] = useState(generateRandomEvents(0, 0));
	const [activeEvent, setActiveEvent] = useState<(typeof dynamicEvents)[0] | null>(null);
	const [termoBusca, setTermoBusca] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	function toFourDecimalPlaces(num: number) {
		return parseFloat(num.toFixed(4));
	}

	// Função para desativar o marker ativo
	const deactivateMarker = () => {
		if (activeMarkerRef.current) {
			const { element } = activeMarkerRef.current;
			element.classList.remove("marker-active");
			activeMarkerRef.current = null;
			setActiveEvent(null);
			setIsDialogOpen(false);
		}
	};

	// Função para ativar o marker
	const activateMarker = useCallback(
		(marker: mapboxgl.Marker, event: (typeof dynamicEvents)[0]) => {
			// Desativar o marker anterior se existir
			deactivateMarker();

			const element = marker.getElement();

			// Adicionar classe ativa ao marker clicado
			element.classList.add("marker-active");

			activeMarkerRef.current = { marker, event, element };
			setActiveEvent(event);
			setIsDialogOpen(true);
		},
		[]
	);

	const handleUpvote = (eventId: string | number) => {
		setDynamicEvents((prev) =>
			prev.map((e) =>
				String(e.id) === String(eventId)
					? { ...e, upvotes: (e.upvotes ?? e.votos ?? 0) + 1 }
					: e
			)
		);
		if (String(activeEvent?.id) === String(eventId)) {
			setActiveEvent((prev) =>
				prev ? { ...prev, upvotes: (prev.upvotes ?? prev.votos ?? 0) + 1 } : prev
			);
		}
	};

	const handleDownvote = (eventId: string | number) => {
		setDynamicEvents((prev) =>
			prev.map((e) =>
				String(e.id) === String(eventId) ? { ...e, downvotes: (e.downvotes ?? 0) + 1 } : e
			)
		);
		if (String(activeEvent?.id) === String(eventId)) {
			setActiveEvent((prev) =>
				prev ? { ...prev, downvotes: (prev.downvotes ?? 0) + 1 } : prev
			);
		}
	};

	// Determinar cor baseada no risco
	const colorMap: Record<string, string> = {
		alto: "#da3263", // frambos - vermelho/rosa
		medio: "#e8752e", // mexerica - laranja
		baixo: "#f9df59", // bananova - amarelo
	};

	// Função para criar marker com animação de fade-in usando Tailwind
	const createAnimatedMarker = useCallback(
		(lat: number, lng: number, risco: string, event: (typeof dynamicEvents)[0]) => {
			const markerEl = document.createElement("div");
			const markerOuter = document.createElement("div");
			const markerInner = document.createElement("div");
			const markerTriangle = document.createElement("div");

			// Adicionar z-index inicial
			markerEl.className = "z-1";

			const bgColor = colorMap[risco] || "#9ca3af";
			const bgColorClass =
				{
					"#da3263": "frambos", // alto - vermelho/rosa
					"#e8752e": "mexerica", // medio - laranja
					"#f9df59": "bananova", // baixo - amarelo
				}[bgColor] || "bg-gray-400";

			// Marker exterior (com cor de fundo, cria o anel colorido)
			markerOuter.className = `w-14 h-14 rounded-full shadow-lg marker-animate flex items-center justify-center border-2 border-black ${bgColorClass}`;
			markerOuter.style.position = "relative";
			markerOuter.style.padding = "5px";

			// Marker interior (com ícone baseado no risco)
			markerInner.className =
				"w-full h-full rounded-full bg-white z-1 flex items-center justify-center";

			// Escolher ícone baseado no risco
			const getIconForRisk = (risco: string) => {
				switch (risco) {
					case "baixo":
						return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`; // Info
					case "medio":
						return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`; // AlertTriangle
					case "alto":
						return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`; // Flame (chama)
					default:
						return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`; // Info como fallback
				}
			};

			// Criar e adicionar o ícone baseado no risco
			const iconContainer = document.createElement("div");
			iconContainer.innerHTML = getIconForRisk(risco);
			markerInner.appendChild(iconContainer.firstChild!);

			// Criar triângulo apontador com borda
			const markerTriangleBorder = document.createElement("div");
			markerTriangleBorder.style.width = "0";
			markerTriangleBorder.style.height = "0";
			markerTriangleBorder.style.borderLeft = "16px solid transparent";
			markerTriangleBorder.style.borderRight = "16px solid transparent";
			markerTriangleBorder.style.borderTop = "16px solid black";
			markerTriangleBorder.style.position = "absolute";
			markerTriangleBorder.style.bottom = "-12px";
			markerTriangleBorder.style.left = "50%";
			markerTriangleBorder.style.transform = "translateX(-50%)";
			markerTriangleBorder.style.zIndex = "0";

			// Criar triângulo apontador (interior)
			markerTriangle.style.width = "0";
			markerTriangle.style.height = "0";
			markerTriangle.style.borderLeft = "14px solid transparent";
			markerTriangle.style.borderRight = "14px solid transparent";
			markerTriangle.style.borderTop = `14px solid ${bgColor}`;
			markerTriangle.style.position = "absolute";
			markerTriangle.style.bottom = "-9px";
			markerTriangle.style.left = "50%";
			markerTriangle.style.transform = "translateX(-50%)";
			markerTriangle.style.zIndex = "1";

			markerEl.appendChild(markerOuter);
			markerOuter.appendChild(markerInner);
			markerOuter.appendChild(markerTriangleBorder);
			markerOuter.appendChild(markerTriangle);
			markerEl.style.cursor = "pointer";

			// Adicionar eventos de hover para z-index
			markerEl.addEventListener("mouseenter", () => {
				markerEl.classList.remove("z-1");
				markerEl.classList.add("z-2");
			});

			markerEl.addEventListener("mouseleave", () => {
				markerEl.classList.remove("z-2");
				markerEl.classList.add("z-1");
			});

			// Adicionar o marker ao mapa
			const marker = new mapboxgl.Marker(markerEl)
				.setLngLat([lng, lat])
				.addTo(mapRef.current!);

			// Adicionar evento de clique ao marker
			markerEl.addEventListener("click", (e) => {
				e.stopPropagation();
				activateMarker(marker, event);
			});

			return marker;
		},
		[activateMarker]
	);

	// Efeito 1: Coletar geolocalização do navegador
	useEffect(() => {
		if (navigator.geolocation) {
			const watchId = navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude, accuracy } = position.coords;
					setUserLocation({ latitude, longitude });
					console.log("✅ Localização atualizada:");
					console.log({
						latitude: toFourDecimalPlaces(latitude),
						longitude: toFourDecimalPlaces(longitude),
						accuracy: `${Math.round(accuracy)} metros`,
					});
				},
				(error) => {
					console.error("❌ Erro ao obter localização:", error.message);
				},
				{
					enableHighAccuracy: true,
					timeout: 30000,
					maximumAge: 0,
				}
			);

			return () => navigator.geolocation.clearWatch(watchId);
		}
	}, []);

	// Efeito 2: Inicializar o mapa (apenas uma vez)
	useEffect(() => {
		mapboxgl.accessToken = accessToken;

		mapRef.current = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/joaoalan15/cmi89010b004301qm4yrz293a",
			center: [0, 0],
			zoom: 18,
			boxZoom: false,
			language: "pt-BR",
			locale: {
				"ScrollZoomBlocker.CtrlMessage": "Use Ctrl + scroll para zoom",
			},
			config: {
				basemap: {
					show3dObjects: false,
				},
			},
		});

		const marker = new mapboxgl.Marker({
			draggable: true,
		})
			.setLngLat([0, 0])
			.addTo(mapRef.current);

		userMarkerRef.current = marker;

		function onDragEnd() {
			const lngLat = marker.getLngLat();
			console.log("📍 Marcador movido para:");
			console.log({
				latitude: toFourDecimalPlaces(lngLat.lat),
				longitude: toFourDecimalPlaces(lngLat.lng),
			});
		}

		marker.on("dragend", onDragEnd);
		mapInitializedRef.current = true;

		return () => mapRef.current?.remove();
	}, []);

	// Efeito 2.5: Criar markers dos eventos quando o mapa e eventos estiverem prontos
	useEffect(() => {
		if (!mapRef.current || !mapInitializedRef.current) return;

		// Esperar o mapa estar pronto
		const createMarkers = () => {
			// Limpar markers anteriores se existirem
			eventMarkersRef.current.forEach((marker) => marker.remove());
			eventMarkersRef.current = [];

			// Criar markers com delay escalonado para efeito visual
			dynamicEvents.forEach((event, index) => {
				setTimeout(() => {
					const marker = createAnimatedMarker(
						event.location.latitude,
						event.location.longitude,
						event.risco,
						event
					);
					eventMarkersRef.current.push(marker);
				}, index * 100);
			});
		};

		if (mapRef.current.isStyleLoaded()) {
			createMarkers();
		} else {
			mapRef.current.on("load", createMarkers);
		}

		return () => {
			if (mapRef.current) {
				mapRef.current.off("load", createMarkers);
			}
		};
	}, [dynamicEvents, createAnimatedMarker]);

	// Efeito: Ajustar o mapa quando o container mudar de tamanho (ex.: sidebar expand/collapse)
	useEffect(() => {
		let resizeTimer: number | null = null;
		const observerTarget = mapContainerRef.current?.parentElement ?? mapContainerRef.current;
		if (!observerTarget) return;

		const ro = new ResizeObserver(() => {
			if (!mapRef.current) return;
			if (resizeTimer) window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(() => {
				mapRef.current?.resize();
			}, 150);
		});

		ro.observe(observerTarget);

		const handleTransitionEnd = (e: TransitionEvent) => {
			if (!mapRef.current) return;
			// Debounce transition end as well
			if (resizeTimer) window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(() => mapRef.current?.resize(), 100);
		};

		document.addEventListener("transitionend", handleTransitionEnd);

		return () => {
			ro.disconnect();
			document.removeEventListener("transitionend", handleTransitionEnd);
			if (resizeTimer) window.clearTimeout(resizeTimer);
		};
	}, []);

	// Efeito 3: Usar localização do usuário para inicializar eventos e mapa
	useEffect(() => {
		// Se o mapa já foi inicializado com localização, não fazer nada mais
		if (userLocationUsedRef.current) {
			return;
		}

		// Se mapa está pronto e temos localização do usuário
		if (mapInitializedRef.current && mapRef.current && userLocation) {
			const userCenter: [number, number] = [userLocation.longitude, userLocation.latitude];

			// Buscar denúncias do backend e mapear para eventos do mapa
			const fetchAndMapDenuncias = async () => {
				// If no backend URL was configured, keep local fallback data
				if (!process.env.NEXT_PUBLIC_API_URL) {
					const newEvents = generateRandomEvents(
						userLocation.latitude,
						userLocation.longitude
					);
					setDynamicEvents(newEvents);
					return;
				}
				try {
					const res = await apiService.get<any>("/api/denuncias");
					const denuncias = Array.isArray(res) ? res : (res.denuncias ?? []);

					// Gerar offsets aleatórios para posicionar as denúncias ao redor do usuário
					const randomOffset = () =>
						(Math.random() * 0.005 + 0.0005) * (Math.random() > 0.5 ? 1 : -1);

					const sampleAddresses = [
						"Rua das Flores, Centro",
						"Avenida Brasil, Jardim América",
						"Praça da República, Centro Histórico",
						"Rua São João, Vila Nova",
						"Avenida Paulista, Bela Vista",
						"Rua Augusta, Consolação",
						"Praça Roosevelt, República",
						"Rua Oscar Freire, Jardins",
						"Avenida Rebouças, Pinheiros",
						"Rua da Consolação, Centro",
					];

					const mappedEvents = denuncias.map((d: any, i: number) => ({
						id: d.id || `denuncia-${i}`,
						title: d.titulo || d.title || "Denúncia",
						address:
							(typeof d.address === "string" && d.address.trim()) ||
							sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)],
						description: d.descricao || d.description || "",
						location: {
							latitude: userLocation.latitude + randomOffset(),
							longitude: userLocation.longitude + randomOffset(),
						},
						risco: d.status || "baixo",
						votos: d.upvotes ?? 0,
						upvotes: d.upvotes ?? 0,
						downvotes: d.downvotes ?? 0,
						medias: d.medias ?? [],
						comentarios: d.comentarios ?? [],
					}));

					// Atualizar estado com os eventos mapeados
					setDynamicEvents(mappedEvents);
				} catch (err) {
					console.error("Erro ao carregar denúncias:", err);
					// Fallback para eventos gerados localmente
					const newEvents = generateRandomEvents(
						userLocation.latitude,
						userLocation.longitude
					);
					setDynamicEvents(newEvents);
				}
			};

			fetchAndMapDenuncias();

			// Mover mapa para a localização do usuário na primeira vez
			mapRef.current.flyTo({
				center: userCenter,
				zoom: 16,
				duration: 1000,
			});

			// Atualizar posição do marcador
			userMarkerRef.current?.setLngLat(userCenter);

			// Marcar que já usamos a localização do usuário
			userLocationUsedRef.current = true;

			// Não mais usamos o 'newEvents' local quando o fetch tiver sucesso

			console.log("🎯 Mapa centralizado na localização do usuário");
		}
	}, [userLocation]);

	return (
		<div className="flex flex-col flex-1">
			<PageTitle
				title="Mapa de Denúncias"
				description="Crie denúncias sobre irregularidades na sua região e interaja com ocorrências públicas em um mapa interativo."
			/>
			<div className="p-8 flex flex-1 gap-4">
				<Card className="flex-1 cardoso p-0 overflow-hidden">
					<CardContent className="h-full p-0">
						<div
							id="map"
							ref={mapContainerRef}
							style={{ height: "100%", width: "100%" }}
							className="bg-[#65cafe] w-full h-full"
							onClick={() => deactivateMarker()}
						></div>
					</CardContent>
				</Card>

				<div className="w-96 space-y-4">
					<h1 className="font-semibold">Suas denúncias</h1>
					<div className="flex flex-col gap-2">
						{[1, 2, 3, 4, 5].map((denuncia) => (
							<Card key={denuncia} className="cardoso p-2">
								<CardContent className="px-0">
									<h2 className="font-bold">Denúncia #{denuncia}</h2>
									<p className="text-sm text-gray-600">
										Descrição breve da denúncia feita pelo usuário.
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>

			{/* Dialog para mostrar detalhes do evento */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md cardoso [&>button:last-child]:hidden">
					<DialogHeader>
						<DialogTitle>{activeEvent?.title}</DialogTitle>
						<DialogDescription>{activeEvent?.description}</DialogDescription>
					</DialogHeader>
					{activeEvent && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-semibold">Risco:</span>
									<div className="flex items-center gap-2 mt-1">
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: colorMap[activeEvent.risco] }}
										></div>
										<span className="capitalize">{activeEvent.risco}</span>
									</div>
								</div>
								<div>
									<span className="font-semibold">Votos:</span>
									<p className="mt-1">{activeEvent.votos}</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-semibold">Upvotes:</span>
									<p className="mt-1">
										{activeEvent.upvotes ?? activeEvent.votos ?? 0}
									</p>
								</div>
								<div>
									<span className="font-semibold">Downvotes:</span>
									<p className="mt-1">{activeEvent.downvotes ?? 0}</p>
								</div>
							</div>

							{activeEvent.medias && activeEvent.medias.length > 0 && (
								<div className="text-sm">
									<span className="font-semibold">Mídia:</span>
									<div className="mt-1">
										<a
											href={activeEvent.medias[0]}
											target="_blank"
											rel="noreferrer"
										>
											<img
												src={activeEvent.medias[0]}
												alt={activeEvent.title}
												className="w-full h-40 object-cover rounded-md shadow-sm"
											/>
										</a>
									</div>
								</div>
							)}
							<div className="text-sm">
								<span className="font-semibold">Endereço:</span>
								<p className="mt-1">{activeEvent.address}</p>
							</div>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-semibold">Latitude:</span>
									<p className="mt-1 font-mono">
										{toFourDecimalPlaces(activeEvent.location.latitude)}
									</p>
								</div>
								<div>
									<span className="font-semibold">Longitude:</span>
									<p className="mt-1 font-mono">
										{toFourDecimalPlaces(activeEvent.location.longitude)}
									</p>
								</div>
							</div>

							{activeEvent.comentarios && activeEvent.comentarios.length > 0 && (
								<div className="mt-3">
									<span className="font-semibold">Comentários:</span>
									<div className="mt-2 space-y-2 max-h-40 overflow-auto">
										{activeEvent.comentarios.map((c: any) => (
											<div key={c.id} className="p-2 bg-gray-50 rounded-md">
												<div className="text-sm text-gray-700">
													{c.texto}
												</div>
												<div className="text-xs text-gray-400 mt-1">
													<span className="font-mono">
														{new Date(c.createdAt).toLocaleString()}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}
					<DialogFooter>
						<Button variant="nevasca" onClick={() => setIsDialogOpen(false)}>
							Fechar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
