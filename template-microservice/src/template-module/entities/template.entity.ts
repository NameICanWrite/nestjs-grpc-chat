/* eslint-disable import/no-cycle */
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';
import { TemplateType } from './template-type.entity';

@Entity({ name: 'template' })
export class Template extends EntityHelper {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => TemplateType)
  templateType: TemplateType;
}
