import { ServerReadableStream, ServerWritableStream } from '@grpc/grpc-js';
import { join } from 'node:path';
import * as fs from 'fs'
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { In, Repository } from 'typeorm';
import * as sharp from "sharp";
import * as fsPromises from 'node:fs/promises'
import {
  AlreadyExistsException,
  InvalidArgumentException,
  NotFoundException,
  PermissionDeniedException,
} from '../utils/exceptions';
import {
  GetFilesRequest,
  FileInfo,
  Empty,
  FileChunk,
  FileId,
} from '../_proto/file.pb';
import { FileEntity } from './file.entity';
import { FirebaseService } from 'src/firebase/firebase.service';



@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,

    private readonly firebaseService: FirebaseService
  ) { }


  async saveAvatarToFirebase(
    grpcStream: Observable<FileChunk>,
  ): Promise<FileInfo> {
    
    const { fileName, localPath, mimetype } = await new Promise<FileInfo & {localPath: string}>((resolve, reject) => {
      // Create a write stream to the local file

      let fileName: string
      let mimetype: string
      let localPath: string
      let savedFileInfo: FileInfo
      let writeStream: fs.WriteStream
      
      grpcStream.subscribe({
        next: async (chunk) => {
          // Get the file name, mimetype and other properties from the chunk
          if (chunk.info) {
            fileName = chunk.info.fileName
            mimetype = chunk.info.mimetype;

            localPath = join(__dirname, fileName);
            writeStream = fs.createWriteStream(localPath);
          };
          
          writeStream.write(chunk.data);
        },

        error: (err) => {
          reject(err);
        },

        complete: () => {
          writeStream.end();
          const fileInfo: FileInfo & {localPath: string} = {
            // id: savedFileInfo.id,
            id: 1,
            fileName,
            mimetype,
            localPath
          };
          console.log('fileInfo from complete:', fileInfo);

          resolve(fileInfo);
        },
      })
    })

    
    await this.resizeImageIfNecessary(localPath, true)

    const readStream = fs.createReadStream(localPath)
    const {id} = await this.fileRepository.save({fileName, mimetype})
    const {firebasePath, firebaseUrl} = await this.firebaseService.uploadFileToFirebase(readStream, {
      fileName,
      firstPartOfPath: `minder/avatars`,
      id
    })
    console.log(firebasePath, firebaseUrl);

    // fsPromises.unlink(localPath)

    return await this.fileRepository.save({
      id,
      firebasePath,
      firebaseUrl,
      fileName,
      mimetype,
    })
  }

  async resizeImageIfNecessary(localFilePath: string, isAnimated?: boolean) {
    const image = sharp(localFilePath, {animated: isAnimated});
    const metadata = await image.metadata();
  
    if (metadata.width && metadata.height && (metadata.width > 320 || metadata.height > 240)) {
      const resizedImage = await image.resize(320, 240).toBuffer();
      await fsPromises.writeFile(localFilePath, resizedImage)
    }
  }

  async getFileInfoById({ id }: FileId): Promise<FileInfo> {
    return await this.fileRepository.findOne({ where: {id}})
  }

  // async getFiles(getFilesRequest: GetFilesRequest): Promise<FileChunk> {
  //   const {
  //     limit,
  //     offset,
  //     files,
  //   } = getFilesRequest;

  //   const [result, total] = await this.fileRepository.findAndCount({
  //     skip: offset,
  //     take: limit,
  //     where: {
  //       id: files ? In(files) : undefined,
  //     },
  //     relations: {
  //       fileType: true,
  //     },
  //   });

  //   return { result, total, limit, offset };
  // }

  // getFile(getFileRequest: FileInfo): Promise<Observable<FileInfo>> {
  //   const {
  //     id
  //   } = getFileRequest;

  //   // get the file name from the request
  //   const fileName = request.fileName;
  //   // get a reference to the Firebase storage bucket
  //   const bucket = this.firebaseService.getBucket();
  //   // create a read stream from the bucket
  //   const readStream = bucket.file(fileName).createReadStream();
  //   // return an observable that emits file chunks
  //   return new Observable((observer) => {
  //     const file = await this.fileRepository.findOne({
  //       where: { id },
  //       relations: {
  //         fileType: true,
  //         },
  //       });
  //     if (!file) {
  //       throw new NotFoundException(`File with id ${id} not found`);
  //     }
  //     readStream.on('data', (chunk) => {
  //       // emit a file chunk
  //       observer.next({ data: chunk });
  //     });
  //     readStream.on('end', () => {
  //       // complete the observable
  //       observer.complete();
  //     });
  //     readStream.on('error', (error) => {
  //       // error the observable
  //       observer.error(error);
  //     });
  //   });

    
  

  // async updateFile(
  //   updateFileRequest: FileChunk,
  // ): Promise<UpdateFileResponse> {
  //   const {
  //     id,
  //     fileTypeId,
  //     name,
  //     description
  //   } = updateFileRequest;
  //   const file = await this.fileRepository.findOne({
  //     relations: {
  //       fileType: true,
  //     },
  //     where: {
  //       id,
  //     },
  //   });

  //   if (!file) {
  //     throw new NotFoundException(`File with id ${id} not found`);
  //   }

  //   const fileType = fileTypeId
  //     ? await this.fileTypeRepository.findOne({
  //         where: {
  //           id: fileTypeId,
  //         },
  //       })
  //     : undefined;

  //   if (fileTypeId && !fileType) {
  //     throw new NotFoundException(`File type with id ${fileTypeId} not found`);
  //   }

  //   const res = await this.fileRepository
  //     .createQueryBuilder('file')
  //     .update(File)
  //     .set({ fileType, name, description })
  //     .where('id = :id', { id })
  //     .returning('*')
  //     .execute();

  //   return res.raw[0];
  // }

  // async deleteFile(
  //   deleteFileRequest: FileInfo,
  // ): Promise<Empty> {
  //   const { id } = deleteFileRequest;
  //   const file = await this.fileRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });

  //   if (!file) {
  //     throw new NotFoundException(`File with id ${id} not found`);
  //   }

  //   await this.fileRepository.delete({
  //     id,
  //   });

  //   return {};
  // }
}
