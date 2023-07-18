/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "file";

export interface FileInfo {
  id?: number | undefined;
  firebasePath?: string | undefined;
  firebaseUrl?: string | undefined;
  fileName?: string | undefined;
  mimetype?: string | undefined;
  createdAt?: string | undefined;
  deletedAt?: string | undefined;
}

export interface FileChunk {
  data: Uint8Array;
  info?: FileInfo | undefined;
}

export interface GetFilesRequest {
  limit: number;
  offset: number;
  firebasePath?: string | undefined;
}

export interface Empty {
}

export interface FileId {
  id: number;
}

export const FILE_PACKAGE_NAME = "file";

export interface FileServiceClient {
  createAvatarFile(request: Observable<FileChunk>, metadata?: Metadata): Observable<FileInfo>;

  /**
   * rpc UpdateFile(FileChunk) returns (FileInfo);
   * rpc GetFiles(GetFilesRequest) returns (FileChunk);
   * rpc GetFile(FileInfo) returns (stream FileChunk);
   * rpc DeleteFile(FileInfo) returns (Empty);
   */

  getFileInfoById(request: FileId, metadata?: Metadata): Observable<FileInfo>;
}

export interface FileServiceController {
  createAvatarFile(
    request: Observable<FileChunk>,
    metadata?: Metadata,
  ): Promise<FileInfo> | Observable<FileInfo> | FileInfo;

  /**
   * rpc UpdateFile(FileChunk) returns (FileInfo);
   * rpc GetFiles(GetFilesRequest) returns (FileChunk);
   * rpc GetFile(FileInfo) returns (stream FileChunk);
   * rpc DeleteFile(FileInfo) returns (Empty);
   */

  getFileInfoById(request: FileId, metadata?: Metadata): Promise<FileInfo> | Observable<FileInfo> | FileInfo;
}

export function FileServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getFileInfoById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("FileService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["createAvatarFile"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("FileService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const FILE_SERVICE_NAME = "FileService";
