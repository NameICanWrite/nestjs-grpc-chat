/* eslint-disable import/no-cycle */
import { Column, Entity } from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';

@Entity({ name: 'chat_type' })
export class ChatType extends EntityHelper {
  @Column({ unique: true })
  name: string;
}
