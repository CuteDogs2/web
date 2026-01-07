import crypto from "crypto";
import Usuário from "../entidades/usuário";

// Error messages constants
const ERROR_MESSAGES = {
  ACESSO_NAO_AUTORIZADO: "Acesso não autorizado."
};

/**
 * Encripta CPF usando SHA-256
 */
function encriptarCpf(cpf: string): string {
  return crypto.createHash('sha256').update(cpf).digest('hex');
}

export default async function verificarErroConteudoToken(request, response, next) {
  const cpf_encriptado = encriptarCpf(request.params.cpf || request.body.cpf);
  const usuario_token = await Usuário.findOne({ where: { email: request.email_token } });
  const usuario = await Usuário.findOne({ where: { cpf: cpf_encriptado } });

  if (usuario_token.email !== usuario.email) {
    return response.status(401).json({ erro: ERROR_MESSAGES.ACESSO_NAO_AUTORIZADO });
  }
  
  next();
}