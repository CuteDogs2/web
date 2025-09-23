import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoCadastrarJornalista, serviçoAtualizarJornalista, serviçoBuscarJornalista } from "../../serviços/serviços-jornalista";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import {estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
  estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputNumber, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarJornalista() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({ especializacao: "", anos_experiencia: "" });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();
  const opçõesEspecializacao = [
      { label: "Política", value: "política" },
      { label: "Esportes", value: "esportes" },
      { label: "Cultura", value: "cultura" },
      { label: "Tecnologia", value: "tecnologia" },
      { label: "Internacional", value: "internacional" },
      { label: "Economia", value: "economia" },
    ];

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  };

  function validarCampos() {
    let errosCamposObrigatórios;
    errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  };

  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Alterar Jornalista";
    else return "Cadastrar Jornalista";
  };

  async function cadastrarJornalista() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarJornalista({ ...dados, usuário_info: usuárioLogado,
          especializacao: dados.especializacao,
          anos_experiencia: dados.anos_experiencia });
        if (response.data)
          setUsuárioLogado(usuário => ({ ...usuário, status: response.data.status,
            token: response.data.token }));
        mostrarToast(referênciaToast, "Jornalista cadastrado com sucesso!", "sucesso");
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  };

  async function atualizarJornalista() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarJornalista({ ...dados, cpf: usuárioLogado.cpf });
        if (response) mostrarToast(referênciaToast, "Jornalista atualizado com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }
  };

  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  };

  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarJornalista();
    else cadastrarJornalista();
  };

  function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado(usuárioLogado => ({ ...usuárioLogado, cadastrado: true }));
      navegar("/página-inicial");
    }
  };

  useEffect(() => {
    let desmontado = false;
    async function buscarDadosJornalista() {
      try {
        const response = await serviçoBuscarJornalista(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados(dados => ({ ...dados, especializacao: response.data.especializacao,
            anos_experiencia: response.data.anos_experiencia }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosJornalista();
    return () => desmontado = true;
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
    <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center"/>
    <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Especialização*:</label>
        <Dropdown name="especializacao"
            className={estilizarDropdown(erros.especializacao, usuárioLogado.cor_tema)}
            value={dados.especializacao} options={opçõesEspecializacao} onChange={alterarEstado}
            placeholder="-- Selecione --"/>
        <MostrarMensagemErro mensagem={erros.especializacao}/>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>
           Anos de Experiência*:</label>
        <InputNumber name="anos_experiencia" size={5}
            value={dados.anos_experiencia}
            onValueChange={alterarEstado} mode="decimal"
            inputClassName={estilizarInputNumber(erros.anos_experiencia,
              usuárioLogado.cor_tema)}/>
        <MostrarMensagemErro mensagem={erros.anos_experiencia}/>
      </div>
      <Divider className={estilizarDivider(dados.cor_tema)}/>
      <div className={estilizarInlineFlex()}>
        <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
        <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar}/>
      </div>
      </Card>
    </div>
  );
};