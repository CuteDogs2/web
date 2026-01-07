import { Perfil } from '../entidades/usuário';

// Error messages constants
const ERROR_MESSAGES = {
  ACESSO_NAO_AUTORIZADO: "Acesso não autorizado."
};

export default function verificarPerfilEditor(request, response, next) {
  if (request.perfil === Perfil.EDITOR_JORNAL) {
    return next();
  } else {
    return response.status(401).json({ erro: ERROR_MESSAGES.ACESSO_NAO_AUTORIZADO });
  }
}