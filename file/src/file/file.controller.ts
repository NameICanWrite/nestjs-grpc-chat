import { ServerReadableStream } from '@grpc/grpc-js';
import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod, GrpcStreamCall } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RpcExceptionFilter } from '../utils/exceptions';
import {
  Empty,
  FileChunk,
  FileId,
  FileInfo,
  FileServiceController,
  FileServiceControllerMethods,
  FILE_SERVICE_NAME,
  GetFilesRequest,
} from '../_proto/file.pb';
import { FileService } from './file.service';

@FileServiceControllerMethods()
@Controller()
export class FileController implements FileServiceController {
  constructor(private readonly fileService: FileService) { }

  // File

  @GrpcMethod(FILE_SERVICE_NAME, 'CreateAvatarFile')
  @UseFilters(RpcExceptionFilter.for('FileController::CreateAvatarFile'))
  createAvatarFile(
    createFileRequest: Observable<FileChunk>,
  ): Promise<FileInfo> {
    return this.fileService.saveAvatarToFirebase(createFileRequest);
  }

  @GrpcMethod(FILE_SERVICE_NAME, 'GetFileInfoById')
  @UseFilters(RpcExceptionFilter.for('FileController::GetFileInfoById'))
  getFileInfoById(
    fileId: FileId,
  ): Promise<FileInfo> {
    return this.fileService.getFileInfoById(fileId);
  }

  // @GrpcMethod(FILE_SERVICE_NAME, 'GetFiles')
  // @UseFilters(RpcExceptionFilter.for('FileController::GetFiles'))
  // getFiles(getFilesRequest: GetFilesRequest): Promise<FileChunk> {
  //   return this.fileService.getFiles(getFilesRequest);
  // }

  // @GrpcMethod(FILE_SERVICE_NAME, 'GetFile')
  // @UseFilters(RpcExceptionFilter.for('FileController::GetFile'))
  // getFile(fileRequest: FileInfo): Observable<FileChunk> {
  //   return this.fileService.getFile(fileRequest)
  // }

  // @GrpcMethod(FILE_SERVICE_NAME, 'UpdateFile')
  // @UseFilters(RpcExceptionFilter.for('FileController::UpdateFile'))
  // updateFile(
  //   updateFileRequest: FileChunk,
  // ): Promise<FileInfo> {
  //   return this.fileService.updateFile(updateFileRequest);
  // }

  // @GrpcMethod(FILE_SERVICE_NAME, 'DeleteFile')
  // @UseFilters(RpcExceptionFilter.for('FileController::DeleteFile'))
  // deleteFile(
  //   deleteFileRequest: FileChunk,
  // ): Promise<Empty> {
  //   return this.fileService.deleteFile(deleteFileRequest);
  // }

}
