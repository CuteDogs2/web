
import { estilizarErro } from "./estilos";

// Error messages constants
const ERROR_MESSAGES = {
  CAMPO_OBRIGATORIO: "Campo obrigatório não preenchido",
  CONFIRMACAO_SENHA: "Senha não confere",
  FORMATO_INVALIDO: "Campo com formato inválido",
  QUESTAO_SEM_RESPOSTA: "Resposta sem questão",
  CPF_INVALIDO: "CPF inválido"
};

export function validarCamposObrigatórios(campos) {
  let errosCamposObrigatórios = {};
  for (let nomeCampo in campos) {
    if (campos[nomeCampo] === "" || campos[nomeCampo] === null) {
      errosCamposObrigatórios[nomeCampo] = ERROR_MESSAGES.CAMPO_OBRIGATORIO;
    }
  }
  return errosCamposObrigatórios;
}

export function validarConfirmaçãoSenha(senha, confirmação_senha) {
  let errosConfirmaçãoSenha = {};
  if (senha !== confirmação_senha) {
    errosConfirmaçãoSenha.confirmação_senha = ERROR_MESSAGES.CONFIRMACAO_SENHA;
  }
  return errosConfirmaçãoSenha;
}

export function validarConfirmaçãoSenhaOpcional(senha, confirmação_senha) {
  let errosConfirmaçãoSenhaOpcional = {};
  if (senha && confirmação_senha && senha !== confirmação_senha) {
    errosConfirmaçãoSenhaOpcional.confirmaçãoSenha = ERROR_MESSAGES.CONFIRMACAO_SENHA;
  }
  return errosConfirmaçãoSenhaOpcional;
}

export function validarCampoEmail(email) {
  // Improved email regex pattern that is more accurate
  const FORMATO_EMAIL = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  let erroEmail = {};
  
  if (!email) {
    erroEmail.email = ERROR_MESSAGES.CAMPO_OBRIGATORIO;
  } else if (!FORMATO_EMAIL.test(email)) {
    erroEmail.email = ERROR_MESSAGES.FORMATO_INVALIDO;
  }
  
  return erroEmail;
}

export function validarRecuperaçãoAcessoOpcional(questão, resposta) {
  let errosRecuperaçãoAcessoOpcional = {};
  if (resposta && !questão) {
    errosRecuperaçãoAcessoOpcional.questão = ERROR_MESSAGES.QUESTAO_SEM_RESPOSTA;
  }
  return errosRecuperaçãoAcessoOpcional;
}

export function checarListaVazia(listaErros) {
  return Object.keys(listaErros).length === 0;
}

export function MostrarMensagemErro({ mensagem }) {
  if (mensagem) {
    return <small className={estilizarErro()}>{mensagem}</small>;
  }
  return null;
}

/**
 * Valida CPF com verificação de dígitos verificadores
 */
export function validarCpf(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  // Valida primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.charAt(9))) {
    return false;
  }
  
  // Valida segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.charAt(10))) {
    return false;
  }
  
  return true;
}