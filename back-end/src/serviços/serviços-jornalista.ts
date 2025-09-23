import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Jornalista from "../entidades/jornalista";
import ServiçosUsuário from "./serviços-usuário";
export default class ServiçosJornalista {
  constructor() {}
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
  };
  static async buscarJornalista(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const jornalista = await Jornalista.findOne({ where: { usuário: cpf_encriptado },
relations: ["usuário"] });
      if (!jornalista) return response.status(404).json({ erro: "Jornalista não encontrado." });
      return response.json({ nome: jornalista.usuário.nome, email: jornalista.usuário.email,
        especialização: jornalista.especialização,
        anos_experiência: jornalista.anos_experiência });
    } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarJornalista" }); }
  };
  static async atualizarJornalista(request, response) {
    try {
      const { cpf, especialização, anos_experiência } = request.body;
      const cpf_encriptado = md5(cpf);
      await Jornalista.update({ usuário: { cpf: cpf_encriptado } }, { especialização, anos_experiência });
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD: atualizarJornalista" }); }
  };
};
