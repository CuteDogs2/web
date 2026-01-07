import crypto from "crypto";

/**
 * Encripta CPF usando SHA-256
 * @param cpf - CPF a ser encriptado
 * @returns Hash SHA-256 do CPF
 */
export function encriptarCpf(cpf: string): string {
  return crypto.createHash('sha256').update(cpf).digest('hex');
}
