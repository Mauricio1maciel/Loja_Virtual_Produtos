import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../servico/Api";

export default function GerenciarMinhaAvaliacao() {
  const { idProduto } = useParams();
  console.log("idProduto:", idProduto);
  const navigate = useNavigate();

  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const [minhaAvaliacao, setMinhaAvaliacao] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const token = localStorage.getItem("token");
  const nomeUsuario = localStorage.getItem("nomeUsuario");
  const idUsuario = localStorage.getItem("idUsuario");

  useEffect(() => {
  if (!token) {
    alert("Você precisa estar logado.");
    navigate("/login");
    return;
  }

  // Nova rota que busca a avaliação do usuário logado para o produto
  Api.Api.get(`/api/avaliacoes/produto/${idProduto}/minha`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then((res) => {
      const avaliacao = res.data;
      if (avaliacao) {
        setMinhaAvaliacao(avaliacao);
        setNota(avaliacao.nota);
        setComentario(avaliacao.comentario);
      }
    })
    .catch((err) => {
      if (err.response?.status !== 404) {
        console.error("Erro ao buscar sua avaliação:", err);
        alert("Erro ao buscar sua avaliação.");
      }
    });
}, [idProduto, token]);



  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);

    const dados = { nota, comentario };

    const requisicao = minhaAvaliacao
      ? Api.Api.put(`/api/avaliacoes/${minhaAvaliacao.idAvaliacao}`, dados, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : Api.Api.post(`/api/avaliacoes/${idProduto}/avaliacoes`, dados, {
          headers: { Authorization: `Bearer ${token}` },
        });

    requisicao
      .then(() => {
        setMensagem(minhaAvaliacao ? "✅ Avaliação atualizada!" : "✅ Avaliação enviada!");
        setTimeout(() => navigate(`/produto/${idProduto}`), 2500);
      })
      .catch((err) => {
        console.error("Erro ao enviar avaliação:", err);
        alert("Erro ao salvar avaliação.");
      })
      .finally(() => setEnviando(false));
  };

  const excluirAvaliacao = () => {
    if (!minhaAvaliacao) return;
    if (!window.confirm("Tem certeza que deseja excluir sua avaliação?")) return;

    Api.Api.delete(`/api/avaliacoes/${minhaAvaliacao.idAvaliacao}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setMensagem("✅ Avaliação excluída.");
        setNota("");
        setComentario("");
        setMinhaAvaliacao(null);
        setTimeout(() => navigate(`/produto/${idProduto}`), 2500);
      })
      .catch((err) => {
        console.error("Erro ao excluir avaliação:", err);
        alert("Erro ao excluir avaliação.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        {minhaAvaliacao ? "✏️ Editar Avaliação" : "📝 Nova Avaliação"}
      </h2>

      {mensagem && <div className="alert alert-success">{mensagem}</div>}

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nota (1 a 5):</label>
          <input
            type="number"
            className="form-control"
            min="1"
            max="5"
            required
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Comentário:</label>
          <textarea
            className="form-control"
            rows={3}
            required
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? "Salvando..." : minhaAvaliacao ? "Salvar Alterações" : "Salvar"}
          </button>
          {minhaAvaliacao && (
            <button type="button" className="btn btn-danger" onClick={excluirAvaliacao}>
              Excluir
            </button>
          )} 
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
