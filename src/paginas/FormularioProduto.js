import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../servico/Api";

export default function FormularioProduto() {
  const navigate = useNavigate();
  
  const { idProduto } = useParams(); 
  const [nomeProduto, setNomeProduto] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const token = localStorage.getItem("token");

  const modoEdicao = !!idProduto;

  useEffect(() => {
    Api.Api.get("/api/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Erro ao carregar categorias", err));

    if (modoEdicao) {
      Api.Api.get(`/api/produtos/${idProduto}`)
        .then((res) => {
          const p = res.data;
          setNomeProduto(p.nomeProduto);
          setImagemUrl(p.imagemUrl || "");
          setPreco(p.preco);
          setDescricao(p.descricao || "");
          setIdCategoria(p.idCategoria || p?.categoria?.idCategoria || "");
          setQuantidadeEstoque(p.quantidadeEstoque || 0);
        })
        .catch((err) =>
          console.error("Erro ao carregar produto para edição", err)
        );
    }
  }, [idProduto]);

  const Salvar = async (e) => {
    e.preventDefault();

    const dados = {
      nomeProduto,
      imagemUrl,
      preco,
      descricao,
      idCategoria,
      quantidadeEstoque,
    };

    try {
      if (modoEdicao) {
        await Api.Api.put(`/api/produtos/${idProduto}`, dados, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem("Produto atualizado com sucesso!");
        setTimeout(() => navigate(`/produto/${idProduto}`), 2000);
      } else {
        await Api.Api.post("/api/produtos", dados, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem("Produto cadastrado com sucesso!");
        setNomeProduto("");
        setImagemUrl("");
        setPreco("");
        setDescricao("");
        setIdCategoria("");
        setQuantidadeEstoque("");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        `Erro ao ${modoEdicao ? "atualizar" : "cadastrar"} produto.`;
      setMensagem(msg);
    }
  };

  const Excluir = async () => {
  const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
  if (!confirmar) return;

  try {
    await Api.Api.delete(`/api/produtos/${idProduto}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Produto excluído com sucesso!");
    navigate("/");
  } catch (error) {
    const msg =
      error.response?.data?.message || "Erro ao excluir produto.";
    alert(msg);
  }
};


  return (
    <div className="container mt-5">
      <h2>{modoEdicao ? "Editar Produto" : "Cadastrar Novo Produto"}</h2>
      {mensagem && <div className="alert alert-info">{mensagem}</div>}

      <form onSubmit={Salvar} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nome do Produto</label>
          <input
            type="text"
            className="form-control"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Imagem (URL)</label>
          <input
            type="url"
            className="form-control"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preço</label>
          <input
            type="number"
            className="form-control"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            step="0.01"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <select
            className="form-select"
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nomeCategoria}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Quantidade em Estoque</label>
          <input
            type="number"
            className="form-control"
            value={quantidadeEstoque}
            onChange={(e) => setQuantidadeEstoque(e.target.value)}
            min="0"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {modoEdicao ? "Atualizar Produto" : "Cadastrar Produto"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate(modoEdicao ? `/produto/${idProduto}` : "/")}
        >
          Cancelar
        </button>
        {modoEdicao && (
  <button
    type="button"
    className="btn btn-danger ms-2"
    onClick={Excluir}
  >
     Excluir
  </button>
)}

      </form>
    </div>
  );
}
