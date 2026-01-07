import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from 'dotenv';
import { sign } from "jsonwebtoken";
import { getManager } from "typeorm";
import Usuário, { Perfil } from "../entidades/usuário";
import Jornalista from "../entidades/jornalista";
import EditorJornal from "../entidades/editor-jornal";

dotenv.config();

// Constants
const SALT_ROUNDS = 10;
const SENHA_JWT = process.env.SENHA_JWT;
const TOKEN_EXPIRATION_LOGIN = "1d";
const TOKEN_EXPIRATION_RECOVERY = "1h";

// Error messages
const ERROR_MESSAGES = {
  CPF_JA_CADASTRADO: "CPF já cadastrado.",
  CPF_NAO_CADASTRADO: "CPF não cadastrado",
  USUARIO_NAO_CADASTRADO: "Nome de usuário não cadastrado.",
  SENHA_INCORRETA: "Senha incorreta.",
  RESPOSTA_INCORRETA: "Resposta incorreta.",
  CADASTRO_INCOMPLETO: "Cadastro incompleto. Por favor, realize o cadastro novamente.",
  DB_ERROR_PREFIX: "Erro BD: "
};

export default class ServiçosUsuário {
  
  /**
   * Encripta CPF usando SHA-256
   */
  private static encriptarCpf(cpf: string): string {
    return crypto.createHash('sha256').update(cpf).digest('hex');
  }
  static async verificarCpfExistente(request, response) {
    try {
      const cpf_encriptado = ServiçosUsuário.encriptarCpf(request.params.cpf);
      const usuário = await Usuário.findOne(cpf_encriptado);
      if (usuário) return response.status(404).json({ erro: ERROR_MESSAGES.CPF_JA_CADASTRADO });
      else return response.json();
    } catch (error) {
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "verificarCpfCadastrado" });
    }
  };
  static async verificarCadastroCompleto(usuário: Usuário): Promise<boolean> {
    switch(usuário.perfil) {
      case Perfil.JORNALISTA:
        const jornalista = await Jornalista.findOne({ 
          where: { usuário: usuário.cpf },
          relations: ["usuário"] 
        });
        return !!jornalista;
      case Perfil.EDITOR_JORNAL:
        const editor_jornal = await EditorJornal.findOne({ 
          where: { usuário: usuário.cpf },
          relations: ["usuário"] 
        });
        return !!editor_jornal;
      default: 
        return false;
    }
  };
  static async logarUsuário(request, response) {
    try {
      const { nome_login, senha } = request.body;
      const cpf_encriptado = ServiçosUsuário.encriptarCpf(nome_login);
      const usuário = await Usuário.findOne(cpf_encriptado);
      
      if (!usuário) {
        return response.status(404).json({ erro: ERROR_MESSAGES.USUARIO_NAO_CADASTRADO });
      }
      
      const cadastro_completo = await ServiçosUsuário.verificarCadastroCompleto(usuário);
      if (!cadastro_completo) {
        await Usuário.remove(usuário);
        return response.status(400).json({ erro: ERROR_MESSAGES.CADASTRO_INCOMPLETO });
      }
      
      const senha_correta = await bcrypt.compare(senha, usuário.senha);
      if (!senha_correta) {
        return response.status(401).json({ erro: ERROR_MESSAGES.SENHA_INCORRETA });
      }
      
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email }, 
        SENHA_JWT, 
        { subject: usuário.nome, expiresIn: TOKEN_EXPIRATION_LOGIN }
      );
      
      return response.json({ 
        usuárioLogado: { 
          nome: usuário.nome, 
          perfil: usuário.perfil,
          email: usuário.email, 
          questão: usuário.questão, 
          status: usuário.status, 
          cor_tema: usuário.cor_tema, 
          token 
        } 
      });
    } catch (error) { 
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "logarUsuário" }); 
    }
  };
  static async cadastrarUsuário(usuário_informado) {
    try {
      const { cpf, nome, perfil, email, senha, questão, resposta, cor_tema } = usuário_informado;
      const cpf_encriptado = ServiçosUsuário.encriptarCpf(cpf);
      const senha_encriptada = await bcrypt.hash(senha, SALT_ROUNDS);
      const resposta_encriptada = await bcrypt.hash(resposta, SALT_ROUNDS);
      
      const usuário = Usuário.create({ 
        cpf: cpf_encriptado, 
        nome, 
        perfil, 
        email,
        senha: senha_encriptada, 
        questão,
        resposta: resposta_encriptada, 
        cor_tema 
      });
      
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email }, 
        SENHA_JWT, 
        { subject: usuário.nome, expiresIn: TOKEN_EXPIRATION_LOGIN }
      );
      
      return { usuário, senha, token };
    } catch (error) { 
      throw new Error(ERROR_MESSAGES.DB_ERROR_PREFIX + "cadastrarUsuário");
    }
  };
  static async alterarUsuário(request, response) {
    try {
      const { cpf, senha, questão, resposta, cor_tema, email } = request.body;
      const cpf_encriptado = ServiçosUsuário.encriptarCpf(cpf);
      let senha_encriptada: string;
      let resposta_encriptada: string;
      let token: string;
      
      const usuário = await Usuário.findOne(cpf_encriptado);
      
      if (email) {
        usuário.email = email;
        token = sign(
          { perfil: usuário.perfil, email }, 
          SENHA_JWT, 
          { subject: usuário.nome, expiresIn: TOKEN_EXPIRATION_LOGIN }
        );
      }
      
      if (cor_tema) {
        usuário.cor_tema = cor_tema;
      }
      
      if (senha) {
        senha_encriptada = await bcrypt.hash(senha, SALT_ROUNDS);
        usuário.senha = senha_encriptada;
      }
      
      if (resposta) {
        resposta_encriptada = await bcrypt.hash(resposta, SALT_ROUNDS);
        usuário.questão = questão;
        usuário.resposta = resposta_encriptada;
      }
      
      await Usuário.save(usuário);
      
      const usuario_info = { 
        nome: usuário.nome, 
        perfil: usuário.perfil, 
        email: usuário.email,
        questão: usuário.questão, 
        status: usuário.status, 
        cor_tema: usuário.cor_tema, 
        token: null 
      };
      
      if (token) {
        usuario_info.token = token;
      }
      
      return response.json(usuario_info);
    } catch (error) { 
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "alterarUsuário" }); 
    }
  };
  static async removerUsuário(request, response) {
    try {
      const cpf_encriptado = ServiçosUsuário.encriptarCpf(request.params.cpf);
      const entityManager = getManager();
      
      await entityManager.transaction(async (transactionManager) => {
        const usuário = await transactionManager.findOne(Usuário, cpf_encriptado);
        await transactionManager.remove(usuário);
      });
      
      return response.json();
    } catch (error) {
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "removerUsuário" });
    }
  };
  static async buscarQuestãoSegurança(request, response) {
    try {
      const cpf_encriptado = ServiçosUsuário.encriptarCpf(request.params.cpf);
      const usuário = await Usuário.findOne(cpf_encriptado);
      
      if (usuário) {
        return response.json({ questão: usuário.questão });
      } else {
        return response.status(404).json({ mensagem: ERROR_MESSAGES.CPF_NAO_CADASTRADO });
      }
    } catch (error) { 
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "buscarQuestãoSegurança" }); 
    }
  };
  
  static async verificarRespostaCorreta(request, response) {
    try {
      const { cpf, resposta } = request.body;
      const cpf_encriptado = ServiçosUsuário.encriptarCpf(cpf);
      const usuário = await Usuário.findOne(cpf_encriptado);
      
      const resposta_correta = await bcrypt.compare(resposta, usuário.resposta);
      if (!resposta_correta) {
        return response.status(401).json({ mensagem: ERROR_MESSAGES.RESPOSTA_INCORRETA });
      }
      
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email },
        SENHA_JWT, 
        { subject: usuário.nome, expiresIn: TOKEN_EXPIRATION_RECOVERY }
      );
      
      return response.json({ token });
    } catch (error) {
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "verificarRespostaCorreta" });
    }
  };
};