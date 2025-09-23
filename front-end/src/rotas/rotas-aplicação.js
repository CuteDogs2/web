import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import CadastrarJornalista from "../páginas/jornalista/cadastrar-jornalista";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarEditorJornal from "../páginas/editor-jornal/cadastrar-editor-jornal";

export default function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuário/>} path="/"/>
        <Route element={<CadastrarUsuário/>} path="criar-usuario"/>
        <Route element={<RecuperarAcesso/>} path="recuperar-acesso"/>
        <Route element={<RotasUsuárioLogado/>}>
          <Route element={<PáginaInicial/>} path="página-inicial"/>
          <Route element={<CadastrarUsuário/>} path="atualizar-usuario"/>
          <Route element={<CadastrarJornalista/>} path="cadastrar-jornalista"/>
          <Route element={<CadastrarEditorJornal/>} path="cadastrar-editor"/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};