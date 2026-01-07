import { Perfil } from "../entidades/usuário";
import { ERROR_MESSAGES } from "../constantes/mensagens-erro";

export default function verificarPerfilJornalista(request, response, next) {
  if (request.perfil === Perfil.JORNALISTA) {
    return next();
  } else {
    return response.status(401).json({ erro: ERROR_MESSAGES.ACESSO_NAO_AUTORIZADO });
  }
}