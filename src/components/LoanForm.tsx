import React, { useState } from "react";
import { api } from "../service/api";

interface SimulationResult {
  amount: number;
  termMonths: number;
  interestRate: number;
  cet: number;
  iof: number;
  totalCost: number;
  installment: number;
  userScore: number;
}

export const LoanForm: React.FC = () => {
  const [form, setForm] = useState({ amount: "", termMonths: "", userScore: "" });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const amountNum = Number(name === "amount" ? value : form.amount);
    const termNum = Number(name === "termMonths" ? value : form.termMonths);
    const scoreNum = Number(name === "userScore" ? value : form.userScore);

    if (amountNum > 1_000_000 || amountNum <= 0) {
      setError("O valor do empréstimo deve ser entre R$ 1 e R$ 1.000.000");
      return;
    }

    if (termNum > 72 || termNum <= 0) {
      setError("O prazo deve ser entre 1 e 72 meses.");
      return;
    }

    if (scoreNum < 800) {
      setError("O score deve ser no mínimo 800.");
      return;
    }

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number(form.amount);
    const termNum = Number(form.termMonths);
    const scoreNum = Number(form.userScore);

    if (error) return;

    try {
      const response = await api.post("/loan/simulate", {
        amount: amountNum,
        termMonths: termNum,
        userScore: scoreNum,
      });
      setResult(response.data);
      setError("");
    } catch (err) {
      console.error("Erro ao simular empréstimo:", err);
      setError("Erro ao simular empréstimo. Verifique o backend.");
    }
  };

  const handleSendContract = async () => {
    if (!result) return;

    const name = prompt("Digite o nome do cliente:");
    const email = prompt("Digite o e-mail do cliente:");

    if (!name || !email) {
      alert("Nome e e-mail são obrigatórios!");
      return;
    }

    try {
      await api.post("/loan/send-contract", {
        name,
        email,
        amount: result.amount,
        termMonths: result.termMonths,
        installment: result.installment,
        totalCost: result.totalCost,
      });
      alert("Contrato enviado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar contrato:", err);
      alert("Erro ao enviar contrato por e-mail.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", textAlign: "center" }}>
      <h2>Simulador de Empréstimo</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ margin: "1rem 0", textAlign: "left" }}>
          <label>Valor do Empréstimo (R$):</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: error.includes("empréstimo") ? "2px solid red" : "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>

        <div style={{ margin: "1rem 0", textAlign: "left" }}>
          <label>Prazo (meses):</label>
          <input
            type="number"
            name="termMonths"
            value={form.termMonths}
            onChange={handleChange}
            required
            disabled={error.includes("empréstimo") && form.amount !== ""}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: error.includes("prazo") ? "2px solid red" : "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>

        <div style={{ margin: "1rem 0", textAlign: "left" }}>
          <label>Score do Usuário:</label>
          <input
            type="number"
            name="userScore"
            value={form.userScore}
            onChange={handleChange}
            required
            disabled={error.includes("empréstimo") || error.includes("prazo")}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 4,
              border: error.includes("score") ? "2px solid red" : "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "red", fontSize: 13, marginTop: -4, textAlign: "left" }}>
            {error}
          </p>
        )}

        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Simular
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "2rem", textAlign: "left" }}>
          <h3>Resultado da Simulação</h3>
          <p><strong>Valor solicitado:</strong> R$ {result.amount}</p>
          <p><strong>Prazo:</strong> {result.termMonths} meses</p>
          <p><strong>Score:</strong> {result.userScore}</p>
          <p><strong>Juros:</strong> {(result.interestRate * 100).toFixed(2)}%</p>
          <p><strong>CET:</strong> {(result.cet * 100).toFixed(2)}%</p>
          <p><strong>IOF:</strong> R$ {result.iof.toFixed(2)}</p>
          <p><strong>Total:</strong> R$ {result.totalCost.toFixed(2)}</p>
          <p><strong>Parcela mensal:</strong> R$ {result.installment.toFixed(2)}</p>

          {/* 🆕 Botão para enviar o contrato por e-mail */}
          <button
            onClick={handleSendContract}
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Enviar Contrato por E-mail
          </button>
        </div>
      )}
    </div>
  );
};
