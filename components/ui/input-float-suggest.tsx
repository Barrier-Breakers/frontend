"use client";

import React, { useEffect, useRef, useState } from "react";
import InputFloat from "./input-label";
import { cn } from "@/lib/utils";
import { searchService, type Suggestion } from "@/services/search.service";

type Props = {
	label?: string;
	placeholder?: string;
	className?: string;
	minChars?: number;
	debounceMs?: number;
	value?: string;
	onChange?: (v: string) => void;
	onSelect?: (v: Suggestion) => void;
	suppressNextFetch?: boolean;
	onSuppressConsumed?: () => void;
};

export default function InputFloatSuggest({
	label,
	placeholder,
	className,
	minChars = 3,
	debounceMs = 300,
	value: valueProp,
	onChange,
	onSelect,
	suppressNextFetch,
	onSuppressConsumed,
}: Props) {
	const [value, setValue] = useState(valueProp ?? "");
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const [highlightIndex, setHighlightIndex] = useState<number>(-1);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const debounceRef = useRef<number | null>(null);
	// When the user selects a suggestion, the value changes and triggers the
	// fetch useEffect. Use this ref to ignore the next automatic fetch and keep
	// the panel closed after selection.
	const skipNextFetchRef = useRef(false);

	useEffect(() => setValue(valueProp ?? ""), [valueProp]);

	useEffect(() => {
		if (suppressNextFetch) {
			skipNextFetchRef.current = true;
			setOpen(false);
			setSuggestions([]);
			onSuppressConsumed?.();
		}
	}, [suppressNextFetch, onSuppressConsumed]);

	useEffect(() => {
		if (debounceRef.current) window.clearTimeout(debounceRef.current);
		if (value.length < minChars) {
			setSuggestions([]);
			setOpen(false);
			return;
		}

		// If we just selected an item, skip the fetch to avoid immediately
		// re-opening the panel on value update that follows selection.
		if (skipNextFetchRef.current) {
			skipNextFetchRef.current = false;
			setLoading(false);
			setSuggestions([]);
			setOpen(false);
			return;
		}

		setLoading(true);
		debounceRef.current = window.setTimeout(async () => {
			try {
				const res = await searchService.suggest(value);
				setSuggestions(res ?? []);
				setHighlightIndex(-1);
				// Always open the suggestions panel once we have results or an empty response,
				// so we can show a "Nenhuma sugestão" state when there are no matches.
				setOpen(true);
			} catch (e) {
				console.error(e);
				setSuggestions([]);
				setOpen(false);
			} finally {
				setLoading(false);
			}
		}, debounceMs);
		return () => {
			if (debounceRef.current) window.clearTimeout(debounceRef.current);
		};
	}, [value, minChars, debounceMs]);

	useEffect(() => {
		function handleDocumentClick(e: MouseEvent) {
			if (!containerRef.current) return;
			if (e.target && containerRef.current.contains(e.target as Node)) return;
			setOpen(false);
		}
		document.addEventListener("mousedown", handleDocumentClick);
		return () => document.removeEventListener("mousedown", handleDocumentClick);
	}, []);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setValue(e.target.value);
		onChange?.(e.target.value);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (!open) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlightIndex((i) => Math.min(suggestions.length - 1, i + 1));
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlightIndex((i) => Math.max(-1, i - 1));
			return;
		}
		if (e.key === "Enter") {
			e.preventDefault();
			if (highlightIndex >= 0 && suggestions[highlightIndex]) {
				handleSelect(suggestions[highlightIndex]);
			}
			return;
		}
		if (e.key === "Escape") {
			setOpen(false);
		}
	}

	function suggestionToLabel(s: Suggestion) {
		const parts: string[] = [];
		if (s.siglaTipo) parts.push(s.siglaTipo);
		if (s.numero) parts.push(`${s.numero}/${s.ano ?? ""}`);
		const head = parts.join(" ");
		return head ? `${head} — ${s.ementa ?? ""}` : (s.ementa ?? "");
	}

	function handleSelect(s: Suggestion) {
		const label = suggestionToLabel(s);
		setValue(label);
		// Skip the next fetch triggered by the value change caused by selection.
		skipNextFetchRef.current = true;
		onChange?.(label);
		onSelect?.(s);
		setOpen(false);
	}

	const shouldScroll = suggestions.length > 5;

	return (
		<div ref={containerRef} className={cn("relative w-full", className)}>
			<InputFloat
				label={label}
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown as any}
			/>

			{open && (
				<div className="absolute z-50 top-full mt-2 w-full rounded-md border bg-popover p-2 shadow-md cardoso">
					{loading && (
						<div className="py-2 text-sm text-muted-foreground">Carregando...</div>
					)}
					{!loading && suggestions.length === 0 && (
						<div className="py-2 text-sm text-muted-foreground">Nenhum resultado</div>
					)}
					<ul
						className={`${shouldScroll ? "max-h-64 overflow-auto" : "max-h-none overflow-visible"}`}
						role="listbox"
					>
						{suggestions.map((s, idx) => (
							<li
								key={s.id}
								role="option"
								aria-selected={highlightIndex === idx}
								className={cn(
									"cursor-pointer rounded-md px-4 py-3 hover:bg-accent/50 border border-transparent",
									highlightIndex === idx
										? "border-2 border-black bg-accent/80"
										: "",
									"focus:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
								)}
								onMouseDown={(e) => {
									e.preventDefault();
									handleSelect(s);
								}}
							>
								<div className="text-base font-semibold leading-tight">
									{s.siglaTipo ? `${s.siglaTipo} ${s.numero}/${s.ano}` : s.ementa}
								</div>
								{s.ementa && (
									<div className="text-foreground line-clamp-2">{s.ementa}</div>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
