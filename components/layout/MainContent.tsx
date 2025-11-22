interface MainContentProps {
	children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
	return (
		<main className="flex-1 overflow-hidden hidden-md:rounded-none md:rounded-tl-3xl md:rounded-bl-3xl main-content-border">
			{children}
		</main>
	);
}
