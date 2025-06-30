import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate, Link } from "react-router-dom";
import Api from "../servico/Api";

export default function LojaVirtual() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  useEffect(() => {
    Api.Api.get("/api/produtos")
      .then((res) => setProdutos(res.data.produtos || []))
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  const produtosFiltrados = produtos.filter((p) => {
    const nomeCategoria = p.nomeCategoria?.trim() || "Sem Categoria";
    const categoriaOk = filtro === "Todos" || nomeCategoria === filtro;
    const buscaOk =
      p.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    return categoriaOk && buscaOk;
  });

  const categoriasDisponiveis = [
    ...new Set(produtos.map((p) => p.nomeCategoria?.trim() || "Sem Categoria")),
  ];

  const abrirModalProduto = (produto) => {
    setProdutoSelecionado(produto);
  };

  return (
    <div className="container my-4">
      <header className="bg-white shadow-sm py-3 mb-4">
        <div className="container d-flex flex-wrap align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img
              src="https://placehold.co/40x40/ff6600/ffffff?text=🛒"
              alt="Logo"
              className="rounded-circle me-2"
            />
            <div>
              <h5 className="m-0 fw-bold text-dark">Loja Virtual - Produtos</h5>
              <small className="text-muted">Sua loja virtual de confiança</small>
            </div>
          </div>
          <div className="mt-3 mt-sm-0">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: "250px" }}
            />
          </div>
        </div>
      </header>
      <div className="container mb-4">
        <div
          className="text-white rounded p-4 shadow text-center"
          style={{ backgroundColor: "#d64c00" }}
        >
          <h3 className="fw-bold">Bem-vindo à Loja Virtual - Produtos!</h3>
          <p className="mb-0">Descubra os melhores produtos com qualidade garantida</p>
        </div>
      </div>
      <div className="container mb-4">
        <div className="bg-white p-4 rounded-4 shadow-sm">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-funnel-fill text-warning fs-5 me-2"></i>
            <h5 className="m-0 fw-semibold">Categorias</h5>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setFiltro("Todos")}
              className={`btn px-3 py-1 fw-semibold ${
                filtro === "Todos" ? "text-white" : "text-primary"
              }`}
              style={{
                backgroundColor: filtro === "Todos" ? "#d64c00" : "#ffffff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Todos ({produtos.length})
            </button>
            {categoriasDisponiveis.map((cat) => {
              const total = produtos.filter(
                (p) => (p.nomeCategoria?.trim() || "Sem Categoria") === cat
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFiltro(cat)}
                  className={`btn px-3 py-1 fw-semibold ${
                    filtro === cat ? "text-white" : "text-primary"
                  }`}
                  style={{
                    backgroundColor: filtro === cat ? "#d64c00" : "#ffffff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  {cat} ({total})
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {localStorage.getItem("isAdmin") === "true" && localStorage.getItem("token") && (
  <div className="d-flex justify-content-end mb-3">
    <Link to="/categorias" className="btn btn-warning me-2">
       Categorias
    </Link>
    <Link to="/produto/cadastrar" className="btn btn-success">
      ➕ Cadastrar Produto
    </Link>
  </div>
)}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Produtos</h4>
        <span className="badge bg-secondary">{produtosFiltrados.length} produtos encontrados</span>
      </div>
      <div className="row">
        {produtosFiltrados.map((produto) => {
          const nomeCategoria = produto.nomeCategoria?.trim() || "Sem Categoria";
          return (
            <div
              key={produto.idProduto}
              className="col-md-6 col-lg-4 col-xl-3 mb-4"
              onClick={() => abrirModalProduto(produto)}
              data-bs-toggle="modal"
              data-bs-target="#modalProduto"
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <img
                    src={produto.imagemUrl || "https://placehold.co/250x250?text=Sem+Imagem"}
                    className="card-img-top object-fit-contain"
                    alt={produto.nomeProduto}
                    style={{ height: "250px", objectFit: "contain", padding: "1rem" }}
                  />
                  <span className="badge bg-dark position-absolute top-0 start-0 m-2">
                    {nomeCategoria}
                  </span>
                  <span className="badge bg-success position-absolute top-0 end-0 m-2">
                    ⭐ {parseFloat(produto.mediaAvaliacoes).toFixed(1)}
                  </span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{produto.nomeProduto}</h5>
                  <p className="fw-bold text-warning">
                    R$ {parseFloat(produto.preco).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="modal fade" id="modalProduto" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {produtoSelecionado && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Detalhes do Produto</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body d-flex flex-column flex-md-row gap-4">
                  <img
                    src={produtoSelecionado.imagemUrl || "https://placehold.co/250x250?text=Sem+Imagem"}
                    alt={produtoSelecionado.nomeProduto}
                    className="card-img-top object-fit-contain"
                    style={{ height: "250px", objectFit: "contain", padding: "1rem" }}
                  />
                  <div>
                    <h4>{produtoSelecionado.nomeProduto}</h4>
                    <p className="text-warning fs-4 fw-semibold">
                      R$ {parseFloat(produtoSelecionado.preco).toFixed(2)}
                    </p>
                    <hr />
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        document.querySelector(".modal-backdrop")?.remove();
                        navigate(`/produto/${produtoSelecionado.idProduto}`);
                      }}
                    >
                      Detalhes do Produto
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
