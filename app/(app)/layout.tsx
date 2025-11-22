"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { HamburgerButton } from "@/components/layout/HamburgerButton";
import { MainContent } from "@/components/layout/MainContent";

export default function PageLayout({ children }: { children: React.ReactNode }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
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
			<div className="flex-1 flex flex-col">
				<MainContent>{children}</MainContent>
			</div>
		</div>
	);
}
