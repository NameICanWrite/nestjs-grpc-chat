import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
// import { FileType } from './entities/file-type.entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileEntity,
      // FileType,
    ]),
    FirebaseModule,
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
