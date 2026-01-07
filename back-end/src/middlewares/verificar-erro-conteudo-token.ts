import Usuário from "../entidades/usuário";
import { ERROR_MESSAGES } from "../constantes/mensagens-erro";
import { encriptarCpf } from "../utils/crypto";

export default async function verificarErroConteudoToken(request, response, next) {
  try {
    const cpf_encriptado = encriptarCpf(request.params.cpf || request.body.cpf);
    const usuario_token = await Usuário.findOne({ where: { email: request.email_token } });
    const usuario = await Usuário.findOne({ where: { cpf: cpf_encriptado } });

    if (!usuario_token || !usuario) {
      return response.status(404).json({ erro: ERROR_MESSAGES.USUARIO_NAO_ENCONTRADO });
    }

    if (usuario_token.email !== usuario.email) {
      return response.status(401).json({ erro: ERROR_MESSAGES.ACESSO_NAO_AUTORIZADO });
    }
    
    next();
  } catch (error) {
    return response.status(500).json({ erro: ERROR_MESSAGES.ERRO_INTERNO_SERVIDOR });
  }
}