// src/components/TravelForm.js
import React, { useState, useRef, useEffect } from "react";
import { marked } from "marked";

import { generatePrompt } from "../utils/generatePrompt";
import { generateGeminiResponse } from "../services/gemini";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isShareAvailable = navigator.share !== undefined;

const tags = ["Relaxar", "Aventura", "Cultura", "Gastronomia", "Natureza", "Romântica"];
const companions = [
  "Sozinho",
  "Casal",
  "Família",
  "Amigos",
  "Romântica",
  "Imersão cultural",
  "Interação com locais"
];
const moods = ["Quero sumir", "Preciso descansar", "Explorar tudo!", "Me surpreenda"];
const regions = [
  "América do Sul",
  "América do Norte",
  "Europa",
  "Ásia",
  "África",
  "Oriente Médio",
  "Oceania",
  "Regiões Geladas"
];

export default function TravelForm() {
  const [destination, setDestination] = useState("");
  const [region, setRegion] = useState("");
  const [duration, setDuration] = useState(5);
  const [budget, setBudget] = useState("R$$");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCompanions, setSelectedCompanions] = useState([]);
  const [climate, setClimate] = useState("Ameno");
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [customMood, setCustomMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.focus();
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  useEffect(() => {
    if (loading) {
      setShowToast(true);
    } else {
      setTimeout(() => setShowToast(false), 500);
    }
  }, [loading]);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    setError("");

    const payload = {
      destination,
      region,
      duration,
      budget,
      tags: selectedTags,
      companions: selectedCompanions,
      climate,
      mood: [...selectedMoods, customMood].filter(Boolean),
    };

    const prompt = generatePrompt(payload);

    try {
      const text = await generateGeminiResponse(prompt);
      setResult(text);
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar o roteiro.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Compartilhamento não suportado neste dispositivo.");
      return;
    }

    try {
      await navigator.share({
        title: "Roteiro gerado no Planeta Gemini",
        text: result,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const handlePrint = () => {
    if (!resultRef.current) return;

    const printContent = resultRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
    <html>
      <head>
        <title>Roteiro de Viagem</title>
        <style>
          body {
            font-family: sans-serif;
            padding: 40px;
            line-height: 1.6;
            color: #111;
          }
          h2 {
            color: #4F46E5;
          }
          .markdown {
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <h2>Roteiro de Viagem</h2>
        <div class="markdown">
          ${printContent}
        </div>
        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md text-sm space-y-4">
      <div className="flex justify-center mb-4">
        <img
          src="/logo-imersao.png"
          alt="Logotipo do projeto Planeta Gemini com selo da Imersão IA"
          className="h-24 md:h-32"
        />
      </div>

      {loading && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white/60 z-50"
          role="presentation"
          aria-hidden="true"
        >
          <div className="animate-pulse w-40 h-40 rounded-full bg-indigo-300 text-white flex items-center justify-center text-center px-4 shadow-md">
            <span className="text-sm font-semibold leading-tight">
              Gerando<br />roteiro...
            </span>
          </div>
        </div>
      )}

      <div className="sr-only" role="status" aria-live="polite">
        {loading ? "Gerando roteiro..." : ""}
      </div>

      <div>
        <label className="block font-medium mb-1">Destino</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Digite uma cidade, país ou deixe em branco"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Região do Planeta</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Escolha uma região ou deixe em branco</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mb-4">
        <legend className="block font-medium mb-1">Duração: {duration} dias</legend>
        <input
          type="range"
          min="3"
          max="10"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full"
        />
      </fieldset>

      <fieldset className="mb-4">
        <legend className="block font-medium mb-1">Orçamento</legend>
        <div className="flex space-x-2">
          {["R$", "R$$", "R$$$"].map((v) => (
            <button
              key={v}
              onClick={() => setBudget(v)}
              className={`flex-1 px-3 py-2 rounded ${budget === v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              aria-pressed={budget === v}
              aria-label={`Selecionar orçamento ${v}`}
            >
              {v}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="block font-medium mb-1">Estilo da Viagem</legend>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleSelection(tag, selectedTags, setSelectedTags)}
              className={`px-3 py-1 rounded-full border ${selectedTags.includes(tag) ? "bg-indigo-500 text-white" : "bg-gray-200"
                }`}
              aria-pressed={selectedTags.includes(tag)}
              aria-label={`Selecionar estilo da viagem: ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="block font-medium mb-1">Companhia</legend>
        <div className="flex flex-wrap gap-2">
          {companions.map((c) => (
            <button
              key={c}
              onClick={() => toggleSelection(c, selectedCompanions, setSelectedCompanions)}
              className={`px-3 py-1 rounded-full border ${selectedCompanions.includes(c) ? "bg-indigo-500 text-white" : "bg-gray-200"
                }`}
              aria-pressed={selectedCompanions.includes(c)}
              aria-label={`Selecionar companhia: ${c}`}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="block font-medium mb-1">Clima</legend>
        <div className="flex space-x-2">
          {["Quente", "Ameno", "Frio"].map((c) => (
            <button
              key={c}
              onClick={() => setClimate(c)}
              className={`flex-1 px-3 py-2 rounded ${climate === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              aria-pressed={climate === c}
              aria-label={`Selecionar clima: ${c}`}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="block font-medium mb-1">Humor do Viajante</legend>
        <div className="flex flex-wrap gap-2 mb-2">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => toggleSelection(m, selectedMoods, setSelectedMoods)}
              className={`px-3 py-1 rounded-full border ${selectedMoods.includes(m) ? "bg-indigo-500 text-white" : "bg-gray-200"
                }`}
              aria-pressed={selectedMoods.includes(m)}
              aria-label={`Selecionar humor: ${m}`}
            >
              {m}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Ou descreva seu humor..."
          className="w-full border rounded px-3 py-2"
          value={customMood}
          onChange={(e) => setCustomMood(e.target.value)}
          aria-label="Descrever seu humor em texto livre"
        />
      </fieldset>

      <button
        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-full mt-2"
        onClick={handleSubmit}
        aria-label="Gerar roteiro de viagem com base nas preferências selecionadas"
      >
        Descobrir meu planeta
      </button>

      {result && (
        <div className="mt-4 bg-white p-4 rounded shadow text-sm">
          <h2 className="text-lg font-bold mb-2 text-indigo-600">Seu roteiro:</h2>
          <div
            ref={resultRef}
            className="markdown outline-none"
            tabIndex="-1"
            role="region"
            aria-label="Roteiro gerado"
            dangerouslySetInnerHTML={{ __html: marked(result.replace(/\n{3,}/g, "\n\n")) }}
          />

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            {isMobile ? (
              <button
                onClick={handleShare}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Compartilhar Roteiro
              </button>
            ) : (
              <button
                onClick={handlePrint}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Exportar como PDF
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </div>
  );
}
