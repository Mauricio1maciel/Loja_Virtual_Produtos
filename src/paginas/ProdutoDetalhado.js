import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../servico/Api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProdutoDetalhado() {
  const navigate = useNavigate();
    
  const { idProduto } = useParams();
  const [produto, setProduto] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const nomeUsuario = localStorage.getItem("nomeUsuario");
  const minhaAvaliacao = avaliacoes.find((a) => a.nomeCliente === nomeUsuario);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const res = await Api.Api.get(`/api/produtos/${idProduto}`);
        setProduto(res.data)
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      }
    };

    const carregarAvaliacoes = async () => {
      try {
        const res = await Api.Api.get(`/api/avaliacoes/${idProduto}/avaliacoes`);
        setAvaliacoes(res.data || []);
      } catch (err) {
        console.warn("Erro ao carregar avaliações:", err);
        setAvaliacoes([]);
      }
    };

    Promise.all([carregarProduto(), carregarAvaliacoes()]).finally(() => {
      setCarregando(false);
    });
  }, [idProduto]);

  if (carregando) return <p className="text-center mt-5">Carregando detalhes...</p>;
  if (!produto) return <p className="text-center mt-5">Produto não encontrado.</p>;

  

  return (
    <div className="container my-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>
        ← Voltar
      </button>

      <div className="card p-4 shadow-sm">
        <div className="row">
          <div className="col-md-4 text-center">
            <img
              src={produto.imagemUrl || "https://placehold.co/300x300?text=Sem+Imagem"}
              alt={produto.nomeProduto}
              className="img-fluid"
            />
          </div> 
          <div className="col-md-8">
            <h3>{produto.nomeProduto}</h3>
            <p className="text-warning fs-4 fw-semibold">
              R$ {parseFloat(produto.preco).toFixed(2)}
            </p>
            <p className="text-muted">
              Categoria: {produto.categoria?.nomeCategoria || "Sem Categoria"}
            </p>
            <p>Detalhes: {produto.descricao}</p>
            <p className="text-muted">
              ⭐ {parseFloat(produto.mediaAvaliacoes || 0).toFixed(1)} / 5.0
            </p>
            {nomeUsuario && (
                <>
                    {!minhaAvaliacao && (
                    <button
                        className="btn btn-primary mt-3 me-2"
                        onClick={() => navigate(`/avaliar/${idProduto}`)}
                    >
                        ⭐ Avaliar Produto
                    </button>
                    )}

                    {minhaAvaliacao && (
                    <button
                        className="btn btn-warning mt-3"
                        onClick={() => navigate(`/avaliacoes/produto/${idProduto}`)}
                    >
                        ✏️ Editar Avaliação
                    </button>
                    )}
                </>
                )}
                {localStorage.getItem("isAdmin") === "true" && (
                <button
                className="btn btn-outline-primary mt-3 ms-2"
                onClick={() => navigate(`/produto/editar/${idProduto}`)}
                >
                ✏️ Editar Produto
                </button>
                )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5 className="fw-bold">Avaliações ({avaliacoes.length})</h5>
        {avaliacoes.length === 0 ? (
          <div className="alert alert-secondary">Nenhuma avaliação encontrada.</div>
        ) : (
          <ul className="list-group">
            {avaliacoes.map((a) => (
              <li key={a.idAvaliacao} className="list-group-item">
                <strong>{a.nomeCliente || "Cliente"}</strong>
                <br />
                Nota: ⭐ {a.nota} / 5
                <br />
                <span className="text-muted">{a.comentario}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
