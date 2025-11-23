"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, X } from "lucide-react";
import { navItems, type NavItem } from "./NavItems";
import { IconRenderer } from "./IconRenderer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { authService } from "@/services/auth.service";

interface SidebarContentProps {
	isMobile?: boolean;
	isExpanded?: boolean;
	onCloseMobile?: () => void;
}

export function SidebarContent({
	isMobile = false,
	isExpanded = false,
	onCloseMobile,
}: SidebarContentProps) {
	const { isActive } = useActiveRoute();
	const router = useRouter();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			const token = authService.getAccessToken();
			if (token) {
				await authService.logout(token);
			} else {
				// Se não houver token, apenas limpa
				authService.clearTokens();
			}
		} catch (error) {
			// authService.logout já trata limpeza de tokens
			console.error("Erro ao fazer logout:", error);
		} finally {
			setIsLoggingOut(false);
			router.push("/login");
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* Close Button - Only on Mobile */}
			{isMobile && (
				<div className="p-3 flex justify-end flex-shrink-0">
					<Button
						variant="nevasca"
						size="icon"
						onClick={onCloseMobile}
						className="p-2 h-auto w-auto"
					>
						<X size={24} />
					</Button>
				</div>
			)}

			{/* Sidebar Content */}
			<nav className="flex-1 flex flex-col gap-1 px-2 py-1 pr-3 overflow-y-auto min-h-0">
				{navItems.map((item: NavItem) => {
					const active = isActive(item.href);
					const isHovering = hoveredItemId === item.id;
					return (
						<Link
							key={item.id}
							href={item.href}
							onClick={isMobile ? onCloseMobile : undefined}
							className="no-underline!"
							onMouseEnter={() => setHoveredItemId(item.id)}
							onMouseLeave={() => setHoveredItemId(null)}
						>
							<Button
								variant={active ? (item.activeVariant as any) : "nevasca"}
								size="lg"
								className="h-14 cursor-pointer w-full flex justify-start gap-4 p-4"
							>
								<div className="flex-shrink-0 flex items-center justify-center w-5">
									<IconRenderer
										iconName={item.iconName || ""}
										lottieAnimation={item.lottieAnimation}
										animateOnHover={item.animateOnHover}
										animationClassName={item.animationClassName}
										isHovering={isHovering}
									/>
								</div>
								{(isExpanded || isMobile) && (
									<span className="text-[1.08rem] font-semibold whitespace-nowrap overflow-hidden">
										{item.label}
									</span>
								)}
							</Button>
						</Link>
					);
				})}
			</nav>

			{/* Logout Button */}
			<div className="p-3 border-t-2 border-black flex-shrink-0">
				<Button
					variant="frambos"
					className="w-full h-10 flex items-center gap-3 px-3 py-3 justify-start cursor-pointer"
					onClick={handleLogout}
					disabled={isLoggingOut}
				>
					<LogOut />
					{(isExpanded || isMobile) && (
						<span className="text-lg font-semibold">
							{isLoggingOut ? "Saindo..." : "Sair"}
						</span>
					)}
				</Button>
			</div>
		</div>
	);
}
