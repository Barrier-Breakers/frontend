"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { HamburgerButton } from "@/components/layout/HamburgerButton";
import { MainContent } from "@/components/layout/MainContent";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Spinner } from "@/components/ui/spinner";

export default function PageLayout({ children }: { children: React.ReactNode }) {
	const { isLoading, isAuthenticated } = useProtectedRoute();
	const [isExpanded, setIsExpanded] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Mostra loading enquanto verifica autenticação
	if (isLoading) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-white">
				<Spinner className="w-10 h-10" />
			</div>
		);
	}

	// Se não autenticado, o hook já redirecionou para /login
	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row">
			{/* Desktop Sidebar */}
			<Sidebar
				isExpanded={isExpanded}
				onMouseEnter={() => setIsExpanded(true)}
				onMouseLeave={() => setIsExpanded(false)}
			/>

			{/* Mobile Hamburger Button */}
			<HamburgerButton
				isOpen={isMobileMenuOpen}
				onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
			/>

			{/* Mobile Sidebar */}
			<MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

			{/* Main Content Container */}
			<div className="flex-1">
				<MainContent>{children}</MainContent>
			</div>
		</div>
	);
}
