import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";
import Jornalista from "./jornalista";
import EditorJornal from "./editor-jornal";
export enum Perfil { EDITOR_JORNAL = "editor de jornal", JORNALISTA = "jornalista" };
export enum Status { PENDENTE = "pendente", ATIVO = "ativo" };
export enum Cores { AMARELO = "yellow", ANIL = "indigo", AZUL = "blue", AZUL_PISCINA = "cyan", 
  CINZA_ESCURO = "bluegray",  LARANJA = "orange", ROSA = "pink", ROXO = "purple", VERDE = "green", 
  VERDE_AZULADO = "teal" };
@Entity()
export default class Usuário extends BaseEntity {
  
  @PrimaryColumn()
  cpf: string;
  @Column({type: "enum", enum: Perfil })
  perfil: Perfil;
  @Column({type: "enum", enum: Status, default: Status.PENDENTE })
  status: Status;
  @Column()
  nome: string;
  @Column()
  email: string;
  @Column()
  senha: string;
  @Column()
  questão: string;
  @Column()
  resposta: string;
  @Column({ type: "enum", enum: Cores })
  cor_tema: string;
  
  @OneToOne(() => Jornalista, (jornalista) => jornalista.usuário)
  jornalista: Jornalista;
  @OneToOne(() => EditorJornal, (editor_jornal) => editor_jornal.usuário)
  editor_jornal: EditorJornal;
  @CreateDateColumn()
  data_criação: Date;
}