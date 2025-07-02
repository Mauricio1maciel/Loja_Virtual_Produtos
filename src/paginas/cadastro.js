import React, { useState } from "react";
import Api from "../servico/Api";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!nomeUsuario || !email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      await Api.Api.post("/api/usuarios", { nomeUsuario, email, senha });
      setMensagem("Usuário cadastrado com sucesso! Faça login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErro(
        err.response?.data?.mensagem ||
        "Erro ao cadastrar usuário."
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cadastro de Usuário</h2>
      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      {erro && <div className="alert alert-danger">{erro}</div>}
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nome de Usuário</label>
          <input
            type="text"
            className="form-control"
            value={nomeUsuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Cadastrar
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/login")}
        >
          Voltar para Login
        </button>
      </form>
    </div>
  );
}