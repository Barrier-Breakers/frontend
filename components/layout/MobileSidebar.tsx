"use client";

import { SidebarContent } from "./SidebarContent";

interface MobileSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
	return (
		<div
			className={`fixed inset-0 z-30 md:hidden transition-opacity duration-300 ease-in-out ${
				isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
			}`}
		>
			<div
				className="fixed inset-0 bg-black/50 transition-opacity duration-300"
				onClick={onClose}
			/>
			<aside
				className={`fixed left-0 top-0 h-full w-80 bg-white flex flex-col shadow-lg z-40 transition-transform duration-300 ease-in-out border-r-4 border-black ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<SidebarContent isMobile={true} onCloseMobile={onClose} />
			</aside>
		</div>
	);
}
