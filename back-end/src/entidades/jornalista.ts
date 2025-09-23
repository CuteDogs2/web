import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 
"typeorm";
import Usuário from "./usuário";
import Matéria from "./matéria";
export enum Especialização {POLÍTICA = "política", ESPORTES = "esportes", CULTURA = "cultura", TECNOLOGIA = "tecnologia", INTERNACIONAL = "internacional", ECONOMIA = "economia", SAÚDE = "saúde", MEIO_AMBIENTE = "meio_ambiente"};
@Entity()
export default class Jornalista extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "enum", enum: Especialização })
  especialização: Especialização;
  @Column()
  anos_experiência: number;
  @OneToMany(() => Matéria, (matéria) => matéria.jornalista)
  matérias: Matéria[];
  @OneToOne(() => Usuário, (usuário) => usuário.jornalista, { onDelete: "CASCADE" })
  @JoinColumn()

  usuário: Usuário;
}