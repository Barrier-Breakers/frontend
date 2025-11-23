"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Suggestion } from "@/services/search.service";

type Props = {
	proposta?: Suggestion | null;
	onBack?: () => void;
};

export default function ProposicaoDetails({ proposta, onBack }: Props) {
	if (!proposta) return null;

	const title = proposta.siglaTipo
		? `${proposta.siglaTipo} ${proposta.numero}/${proposta.ano}`
		: `Proposição ${proposta.id}`;

	return (
		<div className="mb-6">
			<div className="mb-2">
				<Button
					variant="frambos"
					size="sm"
					onClick={onBack}
					className="mr-2 cursor-pointer"
				>
					Voltar
				</Button>
			</div>

			<Card className="cardoso">
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex flex-col">
						<h2 className="text-2xl font-bold">{title}</h2>
						<p className="text-sm text-muted-foreground mt-1">{proposta.ementa}</p>
					</div>
				</div>
				{/* Placeholder for details content. We'll populate later using `proposta` */}
				<div className="px-6 pb-6 pt-2 text-sm text-muted-foreground">
					Detalhes da proposição serão exibidos aqui.
				</div>
			</Card>
		</div>
	);
}
