import { Perfil } from "../entidades/usuário";

// Error messages constants
const ERROR_MESSAGES = {
  ACESSO_NAO_AUTORIZADO: "Acesso não autorizado."
};

export default function verificarPerfilJornalista(request, response, next) {
  if (request.perfil === Perfil.JORNALISTA) {
    return next();
  } else {
    return response.status(401).json({ erro: ERROR_MESSAGES.ACESSO_NAO_AUTORIZADO });
  }
}