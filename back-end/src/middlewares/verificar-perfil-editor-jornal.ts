import { Perfil } from '../entidades/usuário';

export default function verificarPerfilEditor(request, response, next) {
  if (request.perfil === Perfil.EDITOR_JORNAL) return next();
  else return response.status(401).json({ erro: "Acesso não autorizado." });
};