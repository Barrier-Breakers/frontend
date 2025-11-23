interface MainContentProps {
	children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
	return (
		<main className="h-screen overflow-y-auto hidden-md:rounded-none md:rounded-tl-3xl md:rounded-bl-3xl main-content-border flex flex-col">
			{children}
		</main>
	);
}
