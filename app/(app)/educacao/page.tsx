import { PageTitle } from "@/components/layout/PageTitle";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EducacaoPage() {
	return (
		<div>
			<PageTitle
				title="Educação"
				description="Conteúdo da página de educação em desenvolvimento..."
			/>
			<div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
				<div className="text-muted-foreground bg-muted/50 p-6 rounded-full inline-block">
					<BookOpen className="size-8 text-muted-foreground" />
				</div>
				<h2 className="text-2xl font-semibold">Página em construção</h2>
				<p className="text-muted-foreground max-w-xl">
					Esta seção será um roadmap para iniciativas na área da educação. Estamos
					preparando a integração de conteúdo, milestones e ferramentas de acompanhamento.
				</p>
			</div>
		</div>
	);
}
