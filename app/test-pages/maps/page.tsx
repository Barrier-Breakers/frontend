"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { Compass, Plus, Minus, ThumbsUp, ThumbsDown } from "lucide-react";

import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { SearchBox } from "@mapbox/search-js-react";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Componente de controle de navegação customizado
interface NavigationControlsProps {
	mapRef: React.RefObject<mapboxgl.Map | null>;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({ mapRef }) => {
	const handleZoomIn = () => {
		if (mapRef.current) {
			mapRef.current.zoomTo(mapRef.current.getZoom() + 1, {
				duration: 300,
			});
		}
	};

	const handleZoomOut = () => {
		if (mapRef.current) {
			mapRef.current.zoomTo(mapRef.current.getZoom() - 1, {
				duration: 300,
			});
		}
	};

	const handleResetNorth = () => {
		if (mapRef.current) {
			mapRef.current.easeTo({ bearing: 0, pitch: 0, duration: 1000 });
		}
	};

	return (
		<div className="flex flex-col gap-2 pointer-events-auto">
			<button
				onClick={handleZoomIn}
				className="bg-white hover:bg-gray-100 cursor-pointer rounded-lg p-2 shadow-md transition-colors"
				title="Zoom in"
			>
				<Plus size={20} className="text-gray-700" />
			</button>
			<button
				onClick={handleZoomOut}
				className="bg-white hover:bg-gray-100 cursor-pointer rounded-lg p-2 shadow-md transition-colors"
				title="Zoom out"
			>
				<Minus size={20} className="text-gray-700" />
			</button>
			<button
				onClick={handleResetNorth}
				className="bg-white hover:bg-gray-100 cursor-pointer rounded-lg p-2 shadow-md transition-colors"
				title="Reset north"
			>
				<Compass size={20} className="text-gray-700" />
			</button>
		</div>
	);
};

const generateRandomEvents = (userLat: number, userLng: number) => {
	const randomOffset = () => (Math.random() * 0.005 + 0.0001) * (Math.random() > 0.5 ? 1 : -1);

	const titles = [
		"Denúncia de Violência Doméstica",
		"Assédio Sexual no Transporte Público",
		"Discriminação Racial no Trabalho",
		"Violência contra LGBTQIA+",
		"Abuso Infantil",
		"Violência contra Mulheres",
		"Discriminação por Deficiência",
		"Assédio Moral no Ambiente de Trabalho",
		"Violência contra Idosos",
		"Discriminação Religiosa",
		"Violência no Namoro",
		"Abuso Sexual contra Crianças",
	];

	const descriptions = [
		"Relato de agressão física em ambiente doméstico",
		"Incidente de assédio em ônibus lotado",
		"Funcionária demitida por motivo racial",
		"Ataque homofóbico em estabelecimento comercial",
		"Suspeita de negligência infantil",
		"Agressão contra mulher em via pública",
		"Negação de acesso por deficiência",
		"Ambiente de trabalho tóxico com humilhações",
		"Idoso espancado por vizinhos",
		"Recusa de atendimento por crença religiosa",
		"Parceiro controlador e agressivo",
		"Professor suspeito de abuso contra alunos",
	];

	const addresses = [
		"Rua das Flores, 123 - Centro",
		"Avenida Brasil, 456 - Jardim América",
		"Praça da República, 789 - Liberdade",
		"Rua São João, 321 - Vila Nova",
		"Avenida Paulista, 654 - Bela Vista",
		"Rua Augusta, 987 - Consolação",
		"Praça Roosevelt, 147 - República",
		"Rua Oscar Freire, 258 - Jardins",
		"Avenida Brigadeiro, 369 - Paraíso",
		"Rua da Consolação, 741 - Higienópolis",
		"Praça da Sé, 852 - Sé",
		"Rua 25 de Março, 963 - Centro",
	];

	const riscos = ["baixo", "medio", "alto"];

	const numEvents = Math.floor(Math.random() * 5) + 8; // 8-12 eventos

	return Array.from({ length: numEvents }, (_, i) => ({
		id: i + 1,
		title: titles[Math.floor(Math.random() * titles.length)],
		address: addresses[Math.floor(Math.random() * addresses.length)],
		description: descriptions[Math.floor(Math.random() * descriptions.length)],
		location: {
			latitude: userLat + randomOffset(),
			longitude: userLng + randomOffset(),
		},
		risco: riscos[Math.floor(Math.random() * riscos.length)],
		votos: Math.floor(Math.random() * 50) + 1,
		upvotes: Math.floor(Math.random() * 50) + 1,
		downvotes: Math.floor(Math.random() * 10),
		medias: [],
		comentarios: [],
	}));
};

const Page = () => {
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

			// Log do evento
			console.log("✅ Marker ativado:");
			console.log({
				id: event.id,
				title: event.title,
				description: event.description,
				location: event.location,
				risco: event.risco,
				votos: event.votos,
			});

			activeMarkerRef.current = { marker, event, element };
			setActiveEvent(event);
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

			// Marker interior (com ícone ao invés do círculo branco)
			markerInner.className =
				"w-full h-full rounded-full bg-white z-1 flex items-center justify-center";
			// Escolher ícone baseado no risco
			const getIconForRisk = (risco: string) => {
				switch (risco) {
					case "baixo":
						return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`; // Info
					case "medio":
						return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`; // AlertTriangle
					case "alto":
						return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`; // Flame (chama)
					default:
						return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`; // Info como fallback
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
			markerTriangle.style.bottom = "-10px";
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

			// Gerar eventos dinâmicos com base na localização do usuário
			const newEvents = generateRandomEvents(userLocation.latitude, userLocation.longitude);

			// Mover mapa para a localização do usuário na primeira vez
			mapRef.current.flyTo({
				center: userCenter,
				zoom: 18,
				duration: 1000,
			});

			// Atualizar posição do marcador
			userMarkerRef.current?.setLngLat(userCenter);

			// Marcar que já usamos a localização do usuário
			userLocationUsedRef.current = true;

			// Queue state update asynchronously to avoid cascading renders
			queueMicrotask(() => {
				setDynamicEvents(newEvents);
			});

			console.log("🎯 Mapa centralizado na localização do usuário");
		}
	}, [userLocation]);

	return (
		<div className="flex w-full h-screen justify-center items-center">
			{/* Clique no mapa para desativar o marker */}
			<div
				id="map"
				ref={mapContainerRef}
				style={{ height: "100%", width: "100%" }}
				className="bg-[#65cafe] w-full h-full"
				onClick={() => deactivateMarker()}
			></div>

			{/* Painel de Detalhes do Marker - Anima da direita para esquerda */}
			<div
				className={`fixed right-0 top-0 bottom-0 w-96 z-20! pointer-events-none transition-all duration-300 ${
					activeEvent
						? "translate-x-0 opacity-100 pointer-events-auto"
						: "translate-x-40 opacity-0"
				}`}
			>
				<div className="h-full p-8 px-10 flex flex-col justify-center">
					<div
						className={`bg-background/80 h-full rounded-xl border backdrop-blur-md shadow-lg p-4 w-full ${
							activeEvent ? "pointer-events-auto" : "pointer-events-none"
						}`}
					>
						{activeEvent && (
							<>
								<div className="flex items-center gap-2">
									<button
										className="p-1 rounded-md hover:bg-gray-100"
										onClick={() => handleUpvote(activeEvent.id)}
										title="Upvote"
									>
										<ThumbsUp size={16} />
									</button>
									<span className="font-semibold">
										{activeEvent.upvotes ?? activeEvent.votos ?? 0}
									</span>
									<button
										className="p-1 rounded-md hover:bg-gray-100 ml-2"
										onClick={() => handleDownvote(activeEvent.id)}
										title="Downvote"
									>
										<ThumbsDown size={16} />
									</button>
								</div>
								<div className="space-y-2 text-sm">
									<p>
										<span className="font-semibold">Risco:</span>{" "}
										<span className="capitalize">{activeEvent.risco}</span>
									</p>
									<p>
										<span className="font-semibold">Votos:</span>{" "}
										{activeEvent.votos}
									</p>
									<p>
										<span className="font-semibold">Latitude:</span>{" "}
										{toFourDecimalPlaces(activeEvent.location.latitude)}
									</p>
									<p>
										<span className="font-semibold">Longitude:</span>{" "}
										{toFourDecimalPlaces(activeEvent.location.longitude)}
									</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Painel de Informações - Move para esquerda quando details está ativo */}
			<div
				className={`fixed right-0 top-0 bottom-0 z-10 transition-all pointer-events-none duration-300 w-2/9 ${
					activeEvent ? "right-18" : ""
				}`}
			>
				<div className="padding-4 h-full p-8 flex justify-between">
					{/* Controles de Navegação */}
					<div className="pointer-events-none flex items-end p-4 relative">
						<div className="absolute w-96 right-4 top-0 pointer-events-auto">
							{/* <Input className="h-12 bg-white/80 backdrop-blur-md shadow-sm rounded-xl text-lg!" placeholder="Buscar endereço..." /> */}
							<SearchBox
								accessToken={accessToken!}
								options={{
									language: "pt-BR",
									country: "BR",
								}}
								map={mapRef.current!}
								mapboxgl={mapboxgl}
								value={termoBusca}
								onChange={(d) => {
									setTermoBusca(d);
								}}
								marker
							/>
						</div>
						<NavigationControls mapRef={mapRef} />
					</div>

					{/* Painel de Informações */}
					<div
						className={`bg-background/60 rounded-xl border backdrop-blur-md shadow p-4 w-full  ${
							activeEvent ? "pointer-events-none" : "pointer-events-auto"
						}`}
					>
						<div
							className={`absolute w-full h-full top-0 left-0 rounded-xl bg-gray-100 transition-all ${
								activeEvent
									? "opacity-80 backdrop-blur-2xl"
									: "opacity-0 pointer-events-none"
							}`}
						></div>
						<h2 className="text-lg font-bold mb-3 text-gray-800">Perto de você</h2>
						<div className="space-y-2">
							{dynamicEvents?.map((event: any) => (
								<div
									key={event.id}
									className="rounded-sm bg-card hover:bg-white shadow p-2 flex gap-2 border hover:shadow-lg transition-all cursor-pointer"
									onClick={() => {
										const marker = eventMarkersRef.current.find((m) => {
											const markerEvent = dynamicEvents.find(
												(e) => e.id === event.id
											);
											return (
												m.getLngLat().lng.toFixed(4) ===
													markerEvent?.location.longitude.toFixed(4) &&
												m.getLngLat().lat.toFixed(4) ===
													markerEvent?.location.latitude.toFixed(4)
											);
										});
										if (marker) {
											activateMarker(marker, event);
										}
									}}
								>
									<div
										style={{
											backgroundColor: colorMap[event.risco],
										}}
										className={`p-0.5 bg-[${
											colorMap[event.risco]
										}] rounded-full`}
									></div>
									<div className="flex flex-col gap-1 flex-1 py-2">
										<h3 className="font-semibold p-0 m-0 leading-2">
											{event.title} {colorMap[event.risco]}
										</h3>
										<p className="text-sm text-gray-400 dark:text-gray-400">
											{event.address}
											{/*<span className="capitalize">
												{event.risco}
											</span>*/}
										</p>
									</div>

									<div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center px-3 py-1 rounded-full">
										{event.votos}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
