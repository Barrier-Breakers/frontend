"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SentimentCardProps {
	newsId: number;
}

function generateRandomSentiment() {
	const favor = Math.floor(Math.random() * 300) + 50;
	const against = Math.floor(Math.random() * 100) + 10;
	return { favor, against };
}

export function SentimentCard({ newsId }: SentimentCardProps) {
	const [sentiment, setSentiment] = useState<{
		favor: number;
		against: number;
		userVote?: "favor" | "against";
	}>({
		favor: 0,
		against: 0,
		userVote: undefined,
	});

	useEffect(() => {
		const { favor, against } = generateRandomSentiment();
		setSentiment({
			favor,
			against,
			userVote: undefined,
		});
	}, [newsId]);

	const totalVotes = sentiment.favor + sentiment.against;
	const favorPercentage = totalVotes > 0 ? (sentiment.favor / totalVotes) * 100 : 50;
	const againstPercentage = totalVotes > 0 ? (sentiment.against / totalVotes) * 100 : 50;

	const handleVote = (type: "favor" | "against") => {
		setSentiment((prev) => {
			// Se o usuário já votou, remover o voto anterior
			if (prev.userVote === type) {
				return {
					favor: type === "favor" ? prev.favor - 1 : prev.favor,
					against: type === "against" ? prev.against - 1 : prev.against,
					userVote: undefined,
				};
			}

			// Se mudando de voto
			if (prev.userVote) {
				return {
					favor: type === "favor" ? prev.favor + 1 : prev.favor - 1,
					against: type === "against" ? prev.against + 1 : prev.against - 1,
					userVote: type,
				};
			}

			// Novo voto
			return {
				favor: type === "favor" ? prev.favor + 1 : prev.favor,
				against: type === "against" ? prev.against + 1 : prev.against,
				userVote: type,
			};
		});
	};

	return (
		<Card className="cardoso border-2 border-black p-4 h-fit">
			<div className="flex items-center gap-6">
				{/* Barra de Sentimento */}
				<div className="flex-1 min-w-0">
					<div className="flex h-3 rounded-full overflow-hidden border-2 border-black min-w-55">
						<div
							className="limanjar h-3 transition-all duration-300"
							style={{ width: `${favorPercentage}%` }}
						/>
						<div
							className="frambos h-3 transition-all duration-300"
							style={{ width: `${againstPercentage}%` }}
						/>
					</div>

					<div className="flex justify-between text-xs font-semibold mt-2">
						<span className="text-frambos flex gap-2 items-center">
							<ThumbsDown size={16} />
							{sentiment.against}
						</span>
						<span className="text-limanjar flex gap-2 items-center">
							<ThumbsUp size={16} />
							{sentiment.favor}
						</span>
					</div>
				</div>

				{/* Botões de Voto */}
				<div className="flex gap-2">
					<Button
						variant={sentiment.userVote === "against" ? "frambos" : "nevasca"}
						size="sm"
						className="px-3 h-10 flex items-center gap-1 cursor-pointer transition-colors"
						onClick={() => handleVote("against")}
					>
						<ThumbsDown size={16} />
					</Button>
					<Button
						variant={sentiment.userVote === "favor" ? "limanjar" : "nevasca"}
						size="sm"
						className="px-3 h-10 flex items-center gap-1 cursor-pointer transition-colors"
						onClick={() => handleVote("favor")}
					>
						<ThumbsUp size={16} />
					</Button>
				</div>
			</div>
		</Card>
	);
}
