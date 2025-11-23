"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Suggestion } from "@/services/search.service";
import { apiService } from "@/services/api.service";
import { Play, Pause, ArrowLeft, Volume, VolumeX } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Slider } from "../ui/slider";
import ProposicaoInsights from "./ProposicaoInsights";

type Props = {
	proposta?: Suggestion | null;
	onBack?: () => void;
};

// Module-level set to avoid duplicate fetches across rapid mount/unmount cycles
// (React Strict Mode double-invocation can cause two mounts; a module-level guard
// keeps the request unique across component instances in the same page lifecycle)
const _inFlightFetchIds = new Set<string | number>();

export default function ProposicaoDetails({ proposta, onBack }: Props) {
	// render nothing if proposta is not provided
	if (!proposta) return null;

	// const title = proposta.siglaTipo
	// 	? `${proposta.siglaTipo} ${proposta.numero}/${proposta.ano}`
	// 	: `Proposição ${proposta.id}`;

	// States for simplified text + audio
	const [simplifiedText, setSimplifiedText] = useState<string | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [loadingSimplify, setLoadingSimplify] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// audio generation tracking
	const [audioTaskId, setAudioTaskId] = useState<string | null>(null);
	const [audioStatus, setAudioStatus] = useState<string | null>(null);
	const [loadingAudio, setLoadingAudio] = useState(false);

	const [activeVersion, setActiveVersion] = useState<"original" | "simplificado">("original");

	// Audio controls
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const pollIntervalRef = useRef<any>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState<number | null>(null);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [volume, setVolume] = useState<number>(1);
	const [isMuted, setIsMuted] = useState<boolean>(false);

	// Fetch simplified text + audio when `proposta.id` changes
	// Protect against duplicate requests (e.g., React strict mode or double renders) by
	// tracking an in-flight fetch per proposition id and using an AbortController.
	const inFlightRef = useRef<{ id?: string | number; inFlight?: boolean }>({});
	// Base URL for API (use NEXT_PUBLIC_API_URL if set, otherwise fallback)
	const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(
		/\/$/,
		""
	);
	const [simplifyRefreshKey, setSimplifyRefreshKey] = useState(0);
	useEffect(() => {
		const id = proposta?.id;
		if (!id) return;
		// If a fetch is already in progress for this ID on this instance or globally, don't start another
		if (
			(inFlightRef.current.id === id && inFlightRef.current.inFlight) ||
			_inFlightFetchIds.has(id)
		)
			return;

		const controller = new AbortController();
		inFlightRef.current = { id, inFlight: true };
		_inFlightFetchIds.add(id);

		let cancelled = false;
		// reset ref per run
		pollIntervalRef.current = null;
		let pollAttempts = 0;
		async function run() {
			setLoadingSimplify(true);
			setError(null);
			setSimplifiedText(null);
			setAudioUrl(null);
			setDuration(null);
			setCurrentTime(0);
			setIsPlaying(false);
			try {
				console.debug("simplify fetch starting for id", id);
				console.debug("simplify fetch", `/api/proposicoes/${id}/simplify`);
				// Use fetch directly so we can handle 202 Accepted responses
				const simplifyUrl = `${API_BASE}/api/proposicoes/${id}/simplify`;
				console.debug("simplify url", simplifyUrl);
				const resp = await fetch(simplifyUrl, {
					method: "GET",
					signal: controller.signal,
				});
				if (cancelled) return;
				if (resp.status === 200) {
					const ctype = resp.headers.get("content-type") || "";
					if (!ctype.includes("application/json")) {
						const text = await resp.text().catch(() => "");
						console.error("Non-JSON simplify 200:", text.slice(0, 1000));
						setError("Erro interno do servidor (resposta inesperada)");
						return;
					}
					const j = await resp.json();
					setSimplifiedText(j?.text ?? null);
					if (j?.audioBase64) {
						if (audioUrl) URL.revokeObjectURL(audioUrl);
						const blob = base64ToBlob(j.audioBase64, "audio/mpeg");
						const url = URL.createObjectURL(blob);
						setAudioUrl(url);
					}
				} else if (resp.status === 202) {
					const ctype = resp.headers.get("content-type") || "";
					if (!ctype.includes("application/json")) {
						const text = await resp.text().catch(() => "");
						console.error("Non-JSON simplify 202:", text.slice(0, 1000));
						setError("Erro interno do servidor (resposta inesperada)");
						return;
					}
					const j = await resp.json();
					setSimplifiedText(j?.text ?? null);
					const taskId = j?.taskId ?? null;
					setAudioTaskId(taskId);
					setAudioStatus(j?.audioStatus ?? null);
					if (taskId) {
						setLoadingAudio(true);
						console.debug("audio task created", taskId);
						// start polling for audio
						const poll = async () => {
							pollAttempts += 1;
							// Stop after N attempts to avoid infinite polling (e.g., 60 * 1.5s ≈ 90s)
							if (pollAttempts > 60) {
								setLoadingAudio(false);
								setError("Timeout ao gerar áudio");
								if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
								return;
							}
							try {
								const pollUrl = `${API_BASE}/api/proposicoes/${id}/simplify/audio/${taskId}`;
								console.debug("poll url", pollUrl);
								const p = await fetch(pollUrl, { signal: controller.signal });
								if (p.status === 200) {
									const ctype = p.headers.get("content-type") || "";
									if (!ctype.includes("application/json")) {
										const text = await p.text().catch(() => "");
										console.error("Non-JSON audio poll:", text.slice(0, 1000));
										setError("Erro interno do servidor (resposta inesperada)");
										setLoadingAudio(false);
										if (pollIntervalRef.current)
											clearInterval(pollIntervalRef.current);
										return;
									}
									const pj = await p.json();
									setAudioStatus(pj?.status ?? null);
									console.debug(
										"audio poll status",
										pj?.status,
										"attempt",
										pollAttempts
									);
									if (pj?.status === "completed" && pj?.audioBase64) {
										if (audioUrl) URL.revokeObjectURL(audioUrl);
										const blob = base64ToBlob(pj.audioBase64, "audio/mpeg");
										const url = URL.createObjectURL(blob);
										setAudioUrl(url);
										setLoadingAudio(false);
										if (pollIntervalRef.current)
											clearInterval(pollIntervalRef.current);
									} else if (pj?.status === "failed") {
										setLoadingAudio(false);
										setError(pj?.error || "Falha ao gerar áudio");
										if (pollIntervalRef.current)
											clearInterval(pollIntervalRef.current);
									}
								} else if (p.status === 404) {
									setLoadingAudio(false);
									setError("Áudio não encontrado (expirado)");
									if (pollIntervalRef.current)
										clearInterval(pollIntervalRef.current);
								}
							} catch (err) {
								console.error("poll audio error", err);
								setLoadingAudio(false);
								setError("Erro ao buscar áudio");
								if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
							}
						};
						pollIntervalRef.current = setInterval(poll, 1500);
						console.debug("audio poll started for task", taskId);
						setTimeout(() => poll(), 500);
					}
				} else {
					const text = await resp.text().catch(() => "");
					console.error(
						"Unexpected simplify response:",
						resp.status,
						text.slice(0, 1000)
					);
					setError(`Erro: ${resp.status}`);
					return;
				}
			} catch (e) {
				if (controller.signal.aborted) return; // abort was requested
				console.error(e);
				if (!cancelled) setError("Erro ao buscar versão simplificada");
			} finally {
				if (!cancelled) setLoadingSimplify(false);
				// mark as completed only if it was the same id
				if (inFlightRef.current?.id === id) inFlightRef.current.inFlight = false;
				_inFlightFetchIds.delete(id);
			}
		}
		run();
		return () => {
			cancelled = true;
			controller.abort();
			if (audioUrl) URL.revokeObjectURL(audioUrl);
			if (inFlightRef.current?.id === id) inFlightRef.current.inFlight = false;
			_inFlightFetchIds.delete(id);
			if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
		};
	}, [proposta?.id, simplifyRefreshKey]);

	// Attach audio events
	useEffect(() => {
		const audioEl = audioRef.current;
		if (!audioEl) return;
		const el = audioEl as HTMLAudioElement;
		function onLoadedMeta() {
			setDuration(el.duration ?? 0);
		}
		function onTime() {
			setCurrentTime(el.currentTime ?? 0);
		}
		function onEnd() {
			setIsPlaying(false);
		}
		el.addEventListener("loadedmetadata", onLoadedMeta);
		el.addEventListener("timeupdate", onTime);
		el.addEventListener("ended", onEnd);
		return () => {
			el.removeEventListener("loadedmetadata", onLoadedMeta);
			el.removeEventListener("timeupdate", onTime);
			el.removeEventListener("ended", onEnd);
		};
	}, [audioUrl]);

	useEffect(() => {
		if (!audioRef.current) return;
		audioRef.current.volume = volume;
		audioRef.current.muted = isMuted;
	}, [volume, isMuted]);

	// Play/pause control
	useEffect(() => {
		if (!audioRef.current) return;
		if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
		else audioRef.current.pause();
	}, [isPlaying]);

	function togglePlay() {
		if (!audioRef.current) return;
		setIsPlaying((p) => !p);
	}

	function toggleMute() {
		setIsMuted((m) => !m);
		if (!isMuted && audioRef.current) {
			// if unmuting, ensure previous volume or default
			audioRef.current.volume = volume || 1;
		}
	}

	function cancelAudioGeneration() {
		if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
		pollIntervalRef.current = null;
		setLoadingAudio(false);
		setAudioTaskId(null);
		setAudioStatus(null);
		setError("Geração de áudio cancelada");
	}

	function seekTo(normalized: number) {
		if (!audioRef.current || duration == null) return;
		const newTime = normalized * duration;
		// update local state immediately for snappy UI
		setCurrentTime(newTime);
		audioRef.current.currentTime = newTime;
	}

	function base64ToBlob(base64: string, type = "audio/mpeg") {
		const binary = atob(base64);
		const len = binary.length;
		const buffer = new ArrayBuffer(len);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < len; i++) view[i] = binary.charCodeAt(i);
		return new Blob([buffer], { type });
	}

	function formatTime(s?: number | null) {
		if (!s && s !== 0) return "0:00";
		const sec = Math.floor(s || 0);
		const mm = Math.floor(sec / 60);
		const ss = sec % 60;
		return `${mm}:${ss.toString().padStart(2, "0")}`;
	}

	return (
		<div className="mb-6">
			<div className="mb-2 flex items-center gap-3 justify-between">
				<div>
					<Button
						variant="nevasca"
						size="sm"
						onClick={onBack}
						className="mr-2 cursor-pointer"
					>
						<ArrowLeft />
						Voltar
					</Button>
				</div>

				<div>
					<Card className="cardoso py-2 pr-3">
						<div className="flex items-center gap-3 px-4 py-2">
							{loadingSimplify ? (
								<div className="text-sm text-muted-foreground">Carregando...</div>
							) : audioUrl ? (
								<div className="flex items-center gap-3">
									<Button
										variant="bananova"
										className="py-4! cursor-pointer"
										size="sm"
										onClick={togglePlay}
									>
										{isPlaying ? <Pause /> : <Play />}
									</Button>

									<Slider
										min={0}
										max={1}
										step={0.001}
										value={duration ? [currentTime / duration] : [0]}
										onValueChange={(values: number[]) => seekTo(values[0] ?? 0)}
										aria-label="Seek"
										className="w-44 cursor-pointer"
									/>
									<div className="text-sm w-20 text-right">
										{formatTime(currentTime)} / {formatTime(duration)}
									</div>

									<div className="ml-2 relative flex items-center">
										<div className="group relative">
											<Button
												variant="ghost"
												size="sm"
												className="cursor-pointer"
												onClick={() => {
													if (isMuted) setIsMuted(false);
													else setIsMuted(true);
												}}
												onFocus={() => {
													setTimeout(() => {
														const thumb = document.querySelector(
															'#volume-slider [data-slot="slider-thumb"]'
														) as HTMLElement | null;
														if (thumb) thumb.focus();
													}, 0);
												}}
												aria-label="Volume"
											>
												{isMuted || volume === 0 ? <VolumeX /> : <Volume />}
											</Button>
											<div className="hidden group-hover:flex group-focus-within:flex absolute -right-6 -top-38 z-50">
												<div className="bg-popover p-2 rounded-md border shadow-md">
													<Slider
														id="volume-slider"
														min={0}
														max={1}
														step={0.01}
														value={[volume]}
														onValueChange={(values: number[]) => {
															const v = values[0] ?? 0;
															setVolume(v);
															if (v > 0) setIsMuted(false);
															if (audioRef.current)
																audioRef.current.volume = v;
														}}
														orientation="vertical"
														aria-label="Volume"
														className="h-16 w-6"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							) : loadingAudio ? (
								<div className="flex items-center gap-2">
									<Spinner className="w-4 h-4" />
									<div className="text-sm text-muted-foreground">
										Preparando áudio...
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => cancelAudioGeneration()}
									>
										Cancelar
									</Button>
								</div>
							) : (
								<div className="text-sm text-muted-foreground">Sem áudio</div>
							)}
						</div>
						{audioUrl && <audio ref={audioRef} src={audioUrl} />}
						{error ? (
							<div className="px-4 py-2">
								<div className="text-sm text-destructive">{error}</div>
								<div className="mt-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSimplifyRefreshKey((k) => k + 1)}
									>
										Tentar novamente
									</Button>
								</div>
							</div>
						) : null}
					</Card>
				</div>
			</div>

			<Card className="relative cardoso py-2">
				<div className="relative">
					<div className="flex items-start justify-between px-6 py-4">
						<div className="flex-1 min-w-0">
							<ProposicaoInsights
								proposta={proposta}
								simplifiedText={simplifiedText}
								activeVersion={activeVersion}
							/>
						</div>
					</div>
				</div>
				{/* Buttons floating to the right of the card (outside) */}
				<div className="-mt-2 absolute -right-26 w-20 top-2">
					<div className="absolute -right-6 flex flex-col gap-2 z-10 pointer-events-auto">
						<Button
							variant={activeVersion === "original" ? "limanjar" : "nevasca"}
							size="sm"
							onClick={() => setActiveVersion("original")}
							className="cursor-pointer"
						>
							Original
						</Button>
						<Button
							variant={activeVersion === "simplificado" ? "limanjar" : "nevasca"}
							size="sm"
							onClick={() => simplifiedText && setActiveVersion("simplificado")}
							disabled={!simplifiedText}
							className="cursor-pointer"
						>
							Simplificado
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
