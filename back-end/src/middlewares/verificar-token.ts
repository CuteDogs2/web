import dotenv from 'dotenv';
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constantes/mensagens-erro";

dotenv.config();

const SENHA_JWT = process.env.SENHA_JWT;

export default function verificarToken(request, response, next) {
  const header = request.headers.authorization;
  
  if (!header) {
    return response.status(401).json({ erro: ERROR_MESSAGES.TOKEN_NAO_INFORMADO });
  }
  
  const token = header.split(' ')[1];
  
  try {
    const { perfil, email } = verify(token, SENHA_JWT) as JwtPayload;
    request.perfil = perfil;
    request.email_token = email; 
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return response.status(401).json({ erro: ERROR_MESSAGES.TOKEN_EXPIRADO });
    }
    return response.status(401).json({ erro: ERROR_MESSAGES.TOKEN_INVALIDO });
  }
};