import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../servico/Api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CadastrarCategoria() {
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [mensagem, setMensagem] = useState("");
  const { id } = useParams(); // Corrigido aqui
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Carrega categoria para edição
  useEffect(() => {
    if (id) {
      Api.Api.get(`/api/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          console.log("Categoria carregada:", res.data); // debug opcional
          setNomeCategoria(res.data.nomeCategoria);
        })
        .catch(() => setMensagem("Erro ao carregar categoria."));
    }
  }, [id, token]);

  const salvar = async (e) => {
    e.preventDefault();

    if (!nomeCategoria.trim()) {
      setMensagem("O nome da categoria é obrigatório.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const resposta = id
        ? await Api.Api.put(`/api/categorias/${id}`, { nomeCategoria }, config)
        : await Api.Api.post("/api/categorias", { nomeCategoria }, config);

      setMensagem("Categoria salva com sucesso!");
      setTimeout(() => navigate("/categorias"), 1500);
    } catch (erro) {
      if (erro.response?.status === 409) {
        setMensagem("Já existe uma categoria com este nome.");
      } else {
        setMensagem("Erro ao salvar categoria.");
      }
    }
  };

  const excluir = async () => {
    if (!id) return;
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      await Api.Api.delete(`/api/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/categorias");
    } catch (error) {
      setMensagem("Erro ao excluir categoria.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Categoria" : "Cadastrar Categoria"}</h2>

      {mensagem && <div className="alert alert-info">{mensagem}</div>}

      <form onSubmit={salvar}>
        <div className="mb-3">
          <label className="form-label">Nome da Categoria</label>
          <input
            type="text"
            className="form-control"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            💾 {id ? "Salvar Alterações" : "Cadastrar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/categorias")}
          >
            ❌ Cancelar
          </button>
          {id && (
            <button type="button" className="btn btn-danger" onClick={excluir}>
              🗑️ Excluir
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
