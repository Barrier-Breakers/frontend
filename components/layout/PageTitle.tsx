"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageTitleProps {
	title: string;
	description?: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
	const isMobile = useIsMobile();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Renderizar com valor padrão até montar no cliente
	const paddingClass = mounted ? (isMobile ? "ml-20 pt-8" : "p-8") : "p-8";

	return (
		<div className={paddingClass}>
			<h1 className="text-4xl font-bold text-black mb-4">{title}</h1>
			{description && <p className="text-gray-600">{description}</p>}
		</div>
	);
}
