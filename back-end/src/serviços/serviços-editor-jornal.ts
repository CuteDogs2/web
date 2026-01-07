import crypto from "crypto";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import EditorJornal from '../entidades/editor-jornal';
import ServiçosUsuário from "./serviços-usuário";
import { ERROR_MESSAGES } from "../constantes/mensagens-erro";

export default class ServiçosEditorJornal {
  
  /**
   * Encripta CPF usando SHA-256
   */
  private static encriptarCpf(cpf: string): string {
    return crypto.createHash('sha256').update(cpf).digest('hex');
  }

  static async cadastrarEditorJornal(request, response) {
    try {
      const { usuário_info, abrangência, telefone } = request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
      const entityManager = getManager();
      
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const editor = EditorJornal.create({ usuário, abrangência, telefone });
        await transactionManager.save(editor);
        await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) { 
      return response.status(500).json({ erro: error }); 
    }
  }

  static async atualizarEditorJornal(request, response) {
    try {
      const { cpf, telefone, abrangência } = request.body;
      const cpf_encriptado = ServiçosEditorJornal.encriptarCpf(cpf);
      
      await EditorJornal.update(
        { usuário: { cpf: cpf_encriptado } }, 
        { telefone, abrangência }
      );
      
      return response.json();
    } catch (error) { 
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "atualizarEditorJornal" }); 
    }
  }

  static async buscarEditorJornal(request, response) {
    try {
      const cpf_encriptado = ServiçosEditorJornal.encriptarCpf(request.params.cpf);
      const editor = await EditorJornal.findOne({ 
        where: { usuário: cpf_encriptado }, 
        relations: ["usuário"] 
      });
      
      if (!editor) {
        return response.status(404).json({ erro: ERROR_MESSAGES.EDITOR_NAO_ENCONTRADO });
      }
      
      return response.json({
        nome: editor.usuário.nome, 
        email: editor.usuário.email,
        telefone: editor.telefone, 
        abrangência: editor.abrangência
      });
    } catch (error) { 
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "buscarEditorJornal" }); 
    }
  }
}