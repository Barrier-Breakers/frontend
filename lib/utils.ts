import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(
	date?: string | Date | null,
	opts?: { locale?: string; includeTime?: boolean; short?: boolean }
) {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	if (!d || Number.isNaN(d.getTime())) return "";
	const locale = opts?.locale ?? "pt-BR";
	const dateOptions: Intl.DateTimeFormatOptions = opts?.short
		? { day: "2-digit", month: "short", year: "numeric" }
		: { day: "2-digit", month: "long", year: "numeric" };
	const datePart = new Intl.DateTimeFormat(locale, dateOptions).format(d);
	if (!opts?.includeTime) return datePart;
	const timePart = new Intl.DateTimeFormat(locale, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(d);
	return `${datePart}, ${timePart}`;
}
