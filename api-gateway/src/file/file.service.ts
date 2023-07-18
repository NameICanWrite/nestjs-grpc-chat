import { SavedMultipartFile } from "@fastify/multipart";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { firstValueFrom, Observable } from "rxjs";
import * as fs from 'fs'
import { FileChunk, FileId, FileInfo, FileServiceClient, FILE_SERVICE_NAME } from "src/_proto/file.pb";
import { ClientGrpc } from "@nestjs/microservices";

@Injectable()
export class FileService implements OnModuleInit {
  private svc: FileServiceClient;

  @Inject(FILE_SERVICE_NAME)
  private readonly grpcFileClient: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.grpcFileClient.getService<FileServiceClient>(
      FILE_SERVICE_NAME,
    );
  }

  public createAvatarFile(file: SavedMultipartFile, ): Promise<FileInfo> {

    const readStream = fs.createReadStream(file.filepath);

    const writeStream = new Observable<FileChunk>((observer) => {

      let isFirstChunk = true

      readStream.on('data', (chunk) => {
        // Get the file name, mimetype and other properties from the file
        const fileName = file.filename;
        const mimetype = file.mimetype;


        const fileInfo = {
          fileName: fileName,
          mimetype: mimetype,
        }

        // Create a FileChunk object with the properties and data
        const fileChunk: FileChunk = {
          info: isFirstChunk ? fileInfo : undefined,
          data: new Uint8Array(Buffer.from(chunk).buffer),
        };

        isFirstChunk = false

        // Write the chunk to the grpc stream
        observer.next(fileChunk);
      });

      readStream.on('end', () => {
        // Close the grpc stream
        observer.complete();
      });

      readStream.on('error', (err) => {
        // Handle errors
        observer.error(err);
      });
    });

    // Call the grpc method with the write stream
    const result = firstValueFrom(this.svc.createAvatarFile(writeStream));

    // Return the result
    return result;
  }

  async getFileInfoById({id}: FileId): Promise<FileInfo> {
    return await firstValueFrom(this.svc.getFileInfoById({id}));
  }

  // public createFile(file: SavedMultipartFile, ): Promise<FileInfo> {

  //   const readStream = fs.createReadStream(file.filepath);

  //   const writeStream = new Observable<FileChunk>((observer) => {

  //     let isFirstChunk = true

  //     readStream.on('data', (chunk) => {
  //       // Get the file name, mimetype and other properties from the file
  //       const fileName = file.filename;
  //       const mimetype = file.mimetype;
  //       const firebasePath = file.filepath


  //       const fileInfo = {
  //         firebaseId: firebaseId,
  //         firebasePath: firebasePath,
  //         fileName: fileName,
  //         mimetype: mimetype,
  //       }

  //       // Create a FileChunk object with the properties and data
  //       const fileChunk: FileChunk = {
  //         info: isFirstChunk ? fileInfo : undefined,
  //         data: new Uint8Array(Buffer.from(chunk).buffer),
  //       };

  //       isFirstChunk = false

  //       // Write the chunk to the grpc stream
  //       observer.next(fileChunk);
  //     });

  //     readStream.on('end', () => {
  //       // Close the grpc stream
  //       observer.complete();
  //     });

  //     readStream.on('error', (err) => {
  //       // Handle errors
  //       observer.error(err);
  //     });
  //   });

  //   // Call the grpc method with the write stream
  //   const result = firstValueFrom(this.svc.createFile(writeStream));

  //   // Return the result
  //   return result;
  // }
}
  

