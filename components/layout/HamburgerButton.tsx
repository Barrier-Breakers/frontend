import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HamburgerButtonProps {
	isOpen: boolean;
	onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
	return (
		<div
			className={`md:hidden fixed top-4 left-4 transition-all duration-300 ${isOpen ? "z-20" : "z-50"}`}
		>
			<Button variant="nevasca" size="icon" onClick={onClick} className="p-2 h-auto w-auto">
				<Menu size={24} />
			</Button>
		</div>
	);
}
