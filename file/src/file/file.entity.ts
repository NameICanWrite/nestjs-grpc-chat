/* eslint-disable import/no-cycle */
import { FileInfo } from 'src/_proto/file.pb';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { EntityHelper } from '../utils/entity-helper';

@Entity({ name: 'file' })
export class FileEntity extends EntityHelper implements FileInfo {
  @Column()
  fileName: string;

  @Column()
  mimetype: string;

  @Column({nullable: true})
  firebasePath: string;

  @Column({nullable: true})
  firebaseUrl: string;
}
