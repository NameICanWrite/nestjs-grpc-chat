/* eslint-disable import/no-cycle */
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';
import { UserType } from './user-type.entity';

@Entity({ name: 'user' })
export class User extends EntityHelper {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({nullable: true})
  password: string;

  @Column({nullable: true})
  avatarFileId: number;  

  @ManyToOne(() => UserType)
  userType: UserType;
}
