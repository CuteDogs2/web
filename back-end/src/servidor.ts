import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import RotasUsuário from "./rotas/rotas-usuário";
import RotasJornalista from "./rotas/rotas-jornalista";
import RotasEditorJornal from "./rotas/rotas-editor-jornal";

const app = express();
const PORT = process.env.PORT || 3333;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Middlewares
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use("/usuarios", RotasUsuário);
app.use("/jornalistas", RotasJornalista);
app.use("/editores", RotasEditorJornal);

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Database connection
const conexão = createConnection();

export default conexão;