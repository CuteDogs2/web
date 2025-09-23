import md5 from "md5";
import Usuário from "../entidades/usuário";

export default async function verificarErroConteudoToken(request, response, next) {
  const cpf_encriptado = md5(request.params.cpf || request.body.cpf);
  const usuario_token = await Usuário.findOne({ where: { email: request.email_token } });
  const usuario = await Usuário.findOne({ where: { cpf: cpf_encriptado } });

  if (usuario_token.email !== usuario.email) {
    return response.status(401).json("Acesso não autorizado.");
  }
  
  next();
};