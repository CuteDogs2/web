import servidor from "./servidor";

export function serviçoCadastrarEditor(editor) {
    return servidor.post("/editores", editor);
};

export function serviçoAtualizarEditor(editor) {
    return servidor.patch("/editores", editor);
};

export function serviçoBuscarEditor(cpf) {
    return servidor.get(`/editores/${cpf}`);
};