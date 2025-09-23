
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 
"typeorm";
import EditorJornal from "./editor-jornal";
import Matéria from "./matéria";
@Entity()
export default class Aceite extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  feedback: string;
  @CreateDateColumn()
  data: Date;
  @ManyToOne(() => Matéria, (matéria) => matéria.aceites, { onDelete: "CASCADE" })
  matéria: Matéria;
  
  @ManyToOne(() => EditorJornal, (editor_jornal) => editor_jornal.aceites, { onDelete: "CASCADE" })
  editor_jornal: EditorJornal;
}