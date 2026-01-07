/**
 * Mensagens de erro centralizadas para o backend
 */

export const ERROR_MESSAGES = {
  // Autenticação e autorização
  TOKEN_NAO_INFORMADO: "Token não informado.",
  TOKEN_EXPIRADO: "Token expirado, faça login novamente.",
  TOKEN_INVALIDO: "Token inválido.",
  ACESSO_NAO_AUTORIZADO: "Acesso não autorizado.",
  
  // Usuários
  CPF_JA_CADASTRADO: "CPF já cadastrado.",
  CPF_NAO_CADASTRADO: "CPF não cadastrado.",
  USUARIO_NAO_CADASTRADO: "Nome de usuário não cadastrado.",
  USUARIO_NAO_ENCONTRADO: "Usuário não encontrado.",
  SENHA_INCORRETA: "Senha incorreta.",
  RESPOSTA_INCORRETA: "Resposta incorreta.",
  CADASTRO_INCOMPLETO: "Cadastro incompleto. Por favor, realize o cadastro novamente.",
  
  // Perfis específicos
  JORNALISTA_NAO_ENCONTRADO: "Jornalista não encontrado.",
  EDITOR_NAO_ENCONTRADO: "Editor não encontrado.",
  
  // Banco de dados
  DB_ERROR_PREFIX: "Erro BD: ",
  ERRO_INTERNO_SERVIDOR: "Erro interno do servidor."
};
