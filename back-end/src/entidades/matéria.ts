import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Jornalista from "./jornalista";
import Aceite from "./aceite";
export enum Categoria { NOTICIA = "Notícia", REPORTAGEM = "Reportagem", ARTIGO = "Artigo", ENTREVISTA = "Entrevista" };
export enum Status { SUBMETIDA = "submetida", EM_REVISÃO = "em revisão", ACEITA = 
"aceita", REJEITADA = "rejeitada" };
@Entity()
export default class Matéria extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  título: string;
  @Column({ type: "enum", enum: Categoria })
  categoria: Categoria;
  @Column({ type: "date" })
  data_submissão: Date;
  @Column()
  descrição: string;
  @Column({ type: "enum", enum: Status })
  status: Status;
  @ManyToOne(() => Jornalista, (jornalista) => jornalista.matérias, { onDelete: "CASCADE" })
  jornalista: Jornalista;
  @OneToMany(() => Aceite, (aceite) => aceite.matéria)
  aceites: Aceite[];
}