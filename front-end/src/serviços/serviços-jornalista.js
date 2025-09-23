import servidor from "./servidor";

export function serviçoCadastrarJornalista(jornalista) {
    return servidor.post("/jornalistas", jornalista);
};

export function serviçoAtualizarJornalista(jornalista) {
    return servidor.patch("/jornalistas", jornalista);
};

export function serviçoBuscarJornalista(cpf) {
    return servidor.get(`/jornalistas/${cpf}`);
};