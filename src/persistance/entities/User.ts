import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public phone?: string;

  @Column()
  public skype?: string;
}
