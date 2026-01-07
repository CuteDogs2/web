import crypto from "crypto";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Jornalista from "../entidades/jornalista";
import ServiçosUsuário from "./serviços-usuário";

// Error messages constants
const ERROR_MESSAGES = {
  JORNALISTA_NAO_ENCONTRADO: "Jornalista não encontrado.",
  DB_ERROR_PREFIX: "Erro BD: "
};

export default class ServiçosJornalista {
  
  /**
   * Encripta CPF usando SHA-256
   */
  private static encriptarCpf(cpf: string): string {
    return crypto.createHash('sha256').update(cpf).digest('hex');
  }
  
  static async cadastrarJornalista(request, response) {
    try {
      const { usuário_info, especialização, anos_experiência } = request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
      const entityManager = getManager();
      
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const jornalista = Jornalista.create({ usuário, especialização, anos_experiência });
        await transactionManager.save(jornalista);
        await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) { 
      return response.status(500).json({ erro: error }); 
    }
  }
  
  static async buscarJornalista(request, response) {
    try {
      const cpf_encriptado = ServiçosJornalista.encriptarCpf(request.params.cpf);
      const jornalista = await Jornalista.findOne({ 
        where: { usuário: cpf_encriptado },
        relations: ["usuário"] 
      });
      
      if (!jornalista) {
        return response.status(404).json({ erro: ERROR_MESSAGES.JORNALISTA_NAO_ENCONTRADO });
      }
      
      return response.json({ 
        nome: jornalista.usuário.nome, 
        email: jornalista.usuário.email,
        especialização: jornalista.especialização,
        anos_experiência: jornalista.anos_experiência 
      });
    } catch (error) { 
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "buscarJornalista" }); 
    }
  }
  
  static async atualizarJornalista(request, response) {
    try {
      const { cpf, especialização, anos_experiência } = request.body;
      const cpf_encriptado = ServiçosJornalista.encriptarCpf(cpf);
      
      await Jornalista.update(
        { usuário: { cpf: cpf_encriptado } }, 
        { especialização, anos_experiência }
      );
      
      return response.json();
    } catch (error) { 
      return response.status(500).json({ erro: ERROR_MESSAGES.DB_ERROR_PREFIX + "atualizarJornalista" }); 
    }
  }
}
