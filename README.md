# 💰 Simulador de Empréstimo

Um projeto React que simula condições de empréstimo de forma interativa, com **validação instantânea** dos campos e comunicação com o backend via API.

---

## 🧩 Sobre o Projeto

O **Simulador de Empréstimo** permite que o usuário insira:
- **Valor do empréstimo**
- **Prazo (em meses)**
- **Score do usuário**

Com base nesses dados, o frontend envia uma requisição para a API `/loan/simulate`, que retorna:
- Juros,
- CET (Custo Efetivo Total),
- IOF,
- Valor total,
- Parcela mensal.

O sistema exibe os resultados em tela e possui **validação hierárquica em tempo real**, garantindo que:
1. O valor do empréstimo seja válido (entre R$ 1 e R$ 1.000.000);
2. O prazo seja válido (entre 1 e 120 meses);
3. O score seja válido (entre 0 e 1000).

Cada etapa só é validada **após a anterior estar correta**, e o usuário recebe feedback visual imediato com bordas vermelhas e mensagens de erro.

---

## ⚙️ Funcionalidades

- ✅ Validação instantânea dos campos em **pirâmide de importância**  
  (Valor → Prazo → Score)
- ✅ Mensagens de erro automáticas e dinâmicas
- ✅ Inputs com feedback visual (erro em vermelho)
- ✅ Integração com API `/loan/simulate`
- ✅ Exibição dos resultados detalhados da simulação

---

## 🧠 Tecnologias Utilizadas

- **React 18+**
- **TypeScript**
- **Axios** (para requisições HTTP)
- **Vite** (ou Create React App, dependendo do setup)
- **Styled Components / CSS inline**
- **API REST** (backend externo)

---

## 🏗️ Estrutura do Projeto

