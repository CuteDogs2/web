import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilJornalista from "../middlewares/verificar-perfil-jornalista";
import ServiçosJornalista from "../serviços/serviços-jornalista";
const RotasJornalista = Router();
export default RotasJornalista;
RotasJornalista.post("/", ServiçosJornalista.cadastrarJornalista);
RotasJornalista.patch("/", verificarToken, verificarPerfilJornalista, ServiçosJornalista.atualizarJornalista);
RotasJornalista.get("/:cpf", verificarToken, verificarPerfilJornalista,   
    ServiçosJornalista.buscarJornalista);