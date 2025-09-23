import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { TELEFONE_MASCARA } from "../../utilitários/máscaras";
import { serviçoCadastrarEditor, serviçoAtualizarEditor, serviçoBuscarEditor } from "../../serviços/serviços-editor-jornal";
import mostrarToast from "../../utilitários/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios } from "../../utilitários/validações";
import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputMask, estilizarInputText, estilizarLabel } from "../../utilitários/estilos";

export default function CadastrarEditorJornal() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({ telefone: "", abrangencia: "" });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();
  const opçõesAbrangencia = [
    { label: "Local", value: "local" },
    { label: "Regional", value: "regional" },
    { label: "Nacional", value: "nacional" },
    { label: "Internacional", value: "internacional" }
  ];

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  };

  function validarCampos() {
    let errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  };

  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Alterar Editor";
    else return "Cadastrar Editor";
  };

  async function cadastrarEditor() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarEditor({ ...dados, usuário_info: usuárioLogado });
        if (response.data)
          setUsuárioLogado(usuário => ({ ...usuário, status: response.data.status, token: response.data.token }));
        mostrarToast(referênciaToast, "Editor cadastrado com sucesso!", "sucesso");
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  };
  
  async function atualizarEditor() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarEditor({ ...dados, cpf: usuárioLogado.cpf });
        if (response) mostrarToast(referênciaToast, "Editor atualizado com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }
  };

  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  };

  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarEditor();
    else cadastrarEditor();
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
    async function buscarDadosEditor() {
      try {
        const response = await serviçoBuscarEditor(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados(dados => ({ ...dados, ...response.data }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosEditor();
    return () => desmontado = true;
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center"/>
      <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
            <label className={estilizarLabel(usuárioLogado.cor_tema)}>Telefone*:</label>
            <InputMask name="telefone" autoClear size={TAMANHOS.TELEFONE} onChange={alterarEstado} className={estilizarInputMask(erros.telefone, usuárioLogado.cor_tema)} mask={TELEFONE_MASCARA} value={dados.telefone}/>
            <MostrarMensagemErro mensagem={erros.telefone}/>
        </div>
        <div className={estilizarDivCampo()}>
            <label className={estilizarLabel(usuárioLogado.cor_tema)}>Abrangência*:</label>
            <Dropdown name="abrangencia" className={estilizarDropdown(erros.abrangencia, usuárioLogado.cor_tema)} value={dados.abrangencia} options={opçõesAbrangencia} onChange={alterarEstado} placeholder="-- Selecione --"/>
            <MostrarMensagemErro mensagem={erros.abrangencia}/>
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