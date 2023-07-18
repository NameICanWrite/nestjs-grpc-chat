/* eslint-disable import/no-cycle */
import { Column, Entity } from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';

@Entity({ name: 'template_type' })
export class TemplateType extends EntityHelper {
  @Column({ unique: true })
  name: string;
}
