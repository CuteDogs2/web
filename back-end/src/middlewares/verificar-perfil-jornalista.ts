import { Perfil } from "../entidades/usuário";
export default function verificarPerfilJornalista(request, response, next) {
  if (request.perfil === Perfil.JORNALISTA) return next();
  else return response.status(401).json({ erro: "Acesso não autorizado." });
};