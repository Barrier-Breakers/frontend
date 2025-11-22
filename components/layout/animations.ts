"use client";

// Este arquivo contém as animações Lottie que são carregadas apenas no cliente
// para evitar erros de SSR com react-lottie

import newsPaperAnimation from "@/lotties/Newspaper.json";
import searchAnimation from "@/lotties/Search.json";
import mapAnimation from "@/lotties/Map.json";
import calendarAnimation from "@/lotties/Calendar.json";
import learnAnimation from "@/lotties/Learn.json";

export const animations = {
	newspaper: newsPaperAnimation,
	search: searchAnimation,
	map: mapAnimation,
	calendar: calendarAnimation,
	learn: learnAnimation,
};
