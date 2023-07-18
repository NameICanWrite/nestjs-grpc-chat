import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin'
import { Bucket } from '@google-cloud/storage'
import { NotFoundException } from 'src/utils/exceptions';
import { FileInfo } from 'src/_proto/file.pb';
import * as fs from 'fs'
import { BadRequestException } from '@nestjs/common';



@Injectable()
export class FirebaseService implements OnModuleInit {
    onModuleInit() {

        this.bucket = admin.storage().bucket(process.env.FIREBASE_BUCKET_NAME);
    }

    firebaseApp: admin.app.App
    bucket: Bucket

    async uploadFileToFirebase(readStream: fs.ReadStream, fileInfo: {id: number, fileName: string, firstPartOfPath: string}): Promise<{firebasePath: string, firebaseUrl: string}> {
        console.log(`uploading file id: ${fileInfo.id} to firebase...`);
        if (!fileInfo.id || !fileInfo.fileName) {
            throw new BadRequestException('file info missing. we need it to save file to firebase')
        }

        if (!fileInfo.firstPartOfPath) {
            fileInfo.firstPartOfPath = ''
        }

        const fullFilePath = `${fileInfo.firstPartOfPath}/fileId-${fileInfo.id}/${fileInfo.fileName}`
        console.log(`fullFilePath is ${fullFilePath}`);
        const fileRef = this.bucket.file(fullFilePath);

        const writeStream = fileRef.createWriteStream();
        // Pipe the input readStream to the write stream
        readStream.pipe(writeStream);

        return await new Promise((resolve, reject) => {
            // Handle the error event
            writeStream.on('error', (err) => {
                console.error('Upload error:', err);
                // Reject the promise or throw an error
                reject(err);
            });
            // Handle the finish event
            writeStream.on('finish', async () => {
                console.log('Upload finished');

                const [url] = await fileRef.getSignedUrl({
                    action: 'read',
                    expires: '03-01-2500',
                });
                console.log('File URL:', url);
                resolve({
                    firebasePath: fullFilePath,
                    firebaseUrl: url,
                })
            });
        })
    }


    //   async uploadCommentFileToFirebase(readStream, fileInfo: FileInfo) {
    //     const firebasePath = `comment-files/${uuid() + avatar.name}`
    //     await bucket.upload(avatar.tempFilePath, {
    //       destination: firebasePath
    //     })
    //     const fileRef = bucket.file(firebasePath)
    //     const [url] = await fileRef.getSignedUrl({
    //       action: 'read',
    //       expires: '03-01-2500', // Specify the desired expiration date or duration
    //     });
    //     console.log('comment file url = ' + url)
    //     return url
    //   }




    async deleteFileFromFirebase(firebasePath: string) {
        console.log('deleting file from firebase path: ' + firebasePath);
        const fileRef = this.bucket.file(firebasePath)
        const doesExist = await fileRef.exists()
        if (!doesExist) {
            throw new NotFoundException('file does not exist')
        }
        await fileRef.delete()

        console.log('deleted file from firebase path: ' + firebasePath);
    }
}
