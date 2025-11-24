"use client";

import { SidebarContent } from "./SidebarContent";

interface SidebarProps {
	isExpanded: boolean;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
}

export function Sidebar({ isExpanded, onMouseEnter, onMouseLeave }: SidebarProps) {
	return (
		<aside
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={`hidden md:flex transition-all duration-300 ease-in-out ${
				isExpanded ? "w-72" : "w-19"
			} bg-[#f9f5f2] flex-col gap-0`}
		>
			<div className="p-2 flex items-center gap-3 overflow-hidden">
				<img
					src="/logo.webp"
					alt="Barrier Breakers Logo"
					className={`transition-all duration-300 max-w-20 ease-in-out w-15`}
				/>
				{isExpanded && (
					<h1 className="text-2xl font-bold text-center transition-opacity duration-300">
						LegislAí
					</h1>
				)}
			</div>
			<SidebarContent isMobile={false} isExpanded={isExpanded} />
		</aside>
	);
}
