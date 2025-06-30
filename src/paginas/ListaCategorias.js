// src/paginas/ListaCategorias.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../servico/Api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ListaCategorias() {
  const [categorias, setCategorias] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    Api.Api.get("/api/categorias", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, [token]);

  return (
    <div className="container mt-4">
      {/* Banner de destaque */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body bg-warning text-dark rounded">
          <h4 className="card-title mb-1">Bem-vindo à Listagem de Categorias</h4>
          <p className="mb-0 small">Gerencie suas categorias com facilidade e praticidade.</p>
        </div>
      </div>

      {/* Botões de navegação */}
      <div className="d-flex justify-content-end mb-3">
        <Link to="/" className="btn btn-outline-dark me-2">
          ← Voltar
        </Link>
        <Link to="/categoria/cadastrar" className="btn btn-success">
          ➕ Cadastrar Categoria
        </Link>
      </div>

      {/* Tabela de categorias */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "10%" }}>ID</th>
              <th style={{ width: "60%" }}>Nome</th>
              <th style={{ width: "30%" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <tr key={categoria.idCategoria}>
                  <td>{categoria.idCategoria}</td>
                  <td>{categoria.nomeCategoria}</td>
                  <td>
                    <Link
                      to={`/categoria/editar/${categoria.idCategoria}`}
                      className="btn btn-warning btn-sm"
                    >
                      ✏️ Alterar
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
