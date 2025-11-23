import { PageTitle } from "@/components/layout/PageTitle";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalendarioLegislativoPage() {
	return (
		<div>
			<PageTitle
				title="Calendário Legislativo"
				description="Conteúdo da página de calendário legislativo em desenvolvimento..."
			/>
			<div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
				<div className="text-muted-foreground bg-muted/50 p-6 rounded-full inline-block">
					<Calendar className="size-8 text-muted-foreground" />
				</div>
				<h2 className="text-2xl font-semibold">Roadmap em breve</h2>
				<p className="text-muted-foreground max-w-xl">
					O calendário legislativo ainda está em desenvolvimento. Em breve teremos um
					roadmap com agendas, votações e eventos importantes para acompanhamento.
				</p>
			</div>
		</div>
	);
}
