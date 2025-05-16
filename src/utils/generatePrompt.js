export function generatePrompt(payload) {
  return `
Você é um agente de viagens criativo. Monte um roteiro de viagem com as seguintes características:

- Destino: ${payload.destination || "surpreendente"}
- Região: ${payload.region || "qualquer lugar do planeta"}
- Duração: ${payload.duration} dias
- Orçamento: ${payload.budget}
- Estilo: ${payload.tags.join(", ")}
- Companhia: ${payload.companions.join(", ")}
- Clima desejado: ${payload.climate}
- Humor do viajante: ${payload.mood.join(", ")}

Crie um roteiro dia a dia, com sugestões criativas de atividades, hospedagem, culinária local e curiosidades culturais. Use uma linguagem cativante.
`;
}