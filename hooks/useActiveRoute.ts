import { usePathname } from "next/navigation";

export function useActiveRoute() {
	const pathname = usePathname();

	const isActive = (href: string) => {
		// Remove (app) do pathname para comparação
		const cleanPathname = pathname.replace(/^\/(app)/, "");
		return cleanPathname === href || cleanPathname.startsWith(href + "/");
	};

	return { isActive, pathname };
}
