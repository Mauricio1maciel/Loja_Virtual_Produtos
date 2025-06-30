import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./paginas/Login";
import PaginaSegura from "./Componentes/PaginaSegura";
import Home from "./paginas/Home"
import FormularioProduto from "./paginas/FormularioProduto";
import NovaAvaliacao from "./paginas/NovaAvaliacao";
import ProdutoDetalhado from "./paginas/ProdutoDetalhado";
import ListaCategorias from "./paginas/ListaCategorias";
import CadastrarCategoria from "./paginas/FormularioCategoria";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/cadastrar" element={<PaginaSegura> <FormularioProduto /> </PaginaSegura>} />
        <Route path="/categorias" element={<ListaCategorias />} />
        <Route path="/categoria/cadastrar" element={<CadastrarCategoria />} />
        <Route path="/categoria/editar/:id" element={<CadastrarCategoria />} />

        <Route path="/produto/:idProduto" element={<PaginaSegura> <ProdutoDetalhado /> </PaginaSegura>} />
        <Route path="/produto/editar/:idProduto" element={<PaginaSegura> <FormularioProduto /> </PaginaSegura>} />
        <Route path="/avaliacoes/produto/:idProduto" element={<PaginaSegura> <NovaAvaliacao /> </PaginaSegura>} />
        <Route path="/avaliar/:idProduto" element={<PaginaSegura> <NovaAvaliacao /> </PaginaSegura>} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
