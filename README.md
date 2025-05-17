# 🌍 Planeta Gemini - Seu roteiro de viagem, com ou sem destino

**Planeta Gemini** é um aplicativo web interativo desenvolvido durante a [Imersão IA da Alura](https://www.alura.com.br/imersaoia). Ele permite que usuários criem **roteiros personalizados de viagem** com base em seus interesses e preferências, humor e orçamento — tudo isso gerado automaticamente com a **API do Google Gemini**.
Mas o mais incrível? **Se você deixar tudo em branco, o app escolhe um lugar por você** — deixando o Google Gemini te surpreender com um destino inesperado.

## ✅ Destaques do Projeto

- 🤖 **Integração direta com a API do Gemini** para geração de conteúdo dinâmico.
- 🗺️ **Surpresa inteligente**: deixe todos os campos em branco e receba um roteiro surpresa, escolhido pela IA.
- 📱 **Interface responsiva**: otimizada para funcionar em desktop e mobile.
- ♿ **Acessível de verdade**: compatível com leitores de tela e navegação via teclado.
- 📤 **Exportação do roteiro** como PDF (desktop) ou compartilhamento via WhatsApp (mobile).
- 🧠 **Prompting dinâmico**: o prompt enviado à API é construído com base em seleções do usuário em tempo real.

---

## 🔧 Como funciona

### 1. Preenchimento do formulário
O usuário informa:
- Destino (opcional)
- Região do planeta
- Duração da viagem
- Estilo (Relaxar, Aventura, Cultura, etc.)
- Companhia (sozinho, casal, amigos...)
- Clima preferido
- Orçamento
- Humor do viajante

### 2. Geração de Prompt
O formulário monta dinamicamente um prompt estruturado, localizado em:  
`src/utils/generatePrompt.js`

### 3. Chamada da API Gemini
A requisição é enviada via função:  
`src/services/gemini.js`  
> Utiliza a chave `VITE_GEMINI_KEY` armazenada localmente em `.env`.

### 4. Renderização Markdown
O conteúdo retornado é renderizado com `marked` e exibido ao usuário.

---

## 📁 Estrutura do Projeto

```
planeta-gemini/
├── public/
├── src/
│   ├── components/
│   │   └── TravelForm.js      # Componente principal com formulário + lógica de exibição
│   ├── services/
│   │   └── gemini.js          # Integração com a API do Gemini
│   ├── utils/
│   │   └── generatePrompt.js  # Função que monta o prompt dinamicamente
│   └── App.jsx
├── .env                      # Contém a VITE_GEMINI_KEY (não deve ser versionado)
└── README.md
```

---

## 🧪 Tecnologias Utilizadas

- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Marked](https://marked.js.org/) para renderização de Markdown
- [Vercel](https://vercel.com/) (deploy recomendado)

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_GEMINI_KEY=sua-chave-do-gemini
```

---

## 🚀 Como rodar localmente

```bash
git clone https://github.com/savi1411/planeta-gemini.git
cd planeta-gemini
npm install
npm run dev
```

---

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE) – sinta-se livre para usar, estudar e modificar.

---

> Projeto criado por [Carlos Alberto Savi](https://github.com/savi1411) durante a Imersão IA da Alura – Maio 2025.
