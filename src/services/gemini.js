import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

export async function generateGeminiResponse(userPrompt) {
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

  const systemInstruction = `
Você é um agente de viagens experiente e criativo.
Sua missão é montar roteiros personalizados com base nos parâmetros do usuário, mesmo que haja contradições entre eles.
Use bom senso para priorizar os parâmetros mais importantes (ex: destino específico, humor do viajante) e adaptar os demais (ex: clima, estilo de viagem) da melhor forma possível.
Se houver conflito, escolha a alternativa mais coerente com o contexto e explique brevemente sua escolha no início do roteiro.
Responda sempre de forma inspiradora, organizada por dia, e com sugestões envolventes.
  `.trim();

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: `${systemInstruction}\n\n${userPrompt}` },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: 3,
      },
    ],
  });

  const response = await result.response;
  return response.text();
}