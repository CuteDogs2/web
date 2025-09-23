import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilEditor from "../middlewares/verificar-perfil-editor-jornal";
import ServiçosEditorJornal from "../serviços/serviços-editor-jornal";

const RotasEditorJornal = Router();
export default RotasEditorJornal;

RotasEditorJornal.post("/", ServiçosEditorJornal.cadastrarEditorJornal);
RotasEditorJornal.patch("/", verificarToken, verificarPerfilEditor, ServiçosEditorJornal.atualizarEditorJornal);
RotasEditorJornal.get("/:cpf", verificarToken, verificarPerfilEditor, ServiçosEditorJornal.buscarEditorJornal);