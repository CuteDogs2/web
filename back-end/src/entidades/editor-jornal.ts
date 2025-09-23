import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
  from "typeorm";
import Usuário from "./usuário";
import Aceite from "./aceite";
export enum Abrangência { LOCAL = "local", REGIONAL = "regional", NACIONAL = "nacional", INTERNACIONAL = "internacional" };
@Entity()
export default class EditorJornal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "enum", enum: Abrangência })
  abrangência: Abrangência;
  @Column()
  telefone: string;
  @OneToMany(() => Aceite, (aceite) => aceite.editor_jornal)
  aceites: Aceite[];
  @OneToOne(() => Usuário, usuário => usuário.editor_jornal, { onDelete: "CASCADE" })
  @JoinColumn()
  usuário: Usuário;
}