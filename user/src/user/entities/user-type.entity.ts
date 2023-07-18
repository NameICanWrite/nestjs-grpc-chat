/* eslint-disable import/no-cycle */
import { Column, Entity } from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';

@Entity({ name: 'user_type' })
export class UserType extends EntityHelper {
  @Column({ unique: true })
  name: string;
}
