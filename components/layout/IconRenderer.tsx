import {
	Home,
	MapPin,
	Users,
	Settings,
	LucideIcon,
	Search,
	Newspaper,
	Map,
	GraduationCap,
	Calendar,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
	Home,
	MapPin,
	Users,
	Settings,
	Search,
	Newspaper,
	Map,
	GraduationCap,
	Calendar,
};

interface IconRendererProps {
	iconName: string;
	size?: number;
}

export function IconRenderer({ iconName, size = 40 }: IconRendererProps) {
	const Icon = iconMap[iconName];
	if (!Icon) return null;
	return <Icon size={size} className="w-6! h-6! stroke-[2.5px]" />;
}
