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
			<SidebarContent isMobile={false} isExpanded={isExpanded} />
		</aside>
	);
}
