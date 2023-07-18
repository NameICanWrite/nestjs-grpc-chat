// import { UploadedFile } from "express-fileupload";
// import admin from "firebase-admin";
// import {getStorage} from 'firebase-admin/storage'
// import {v4 as uuid} from 'uuid'
// // Initialize Firebase
// const app = admin.initializeApp({
//   credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_PRIVATE_KEY)),
//   storageBucket: "my-test-tasks.appspot.com",
// });

// const storage = admin.storage(app)
// admin.getStorage()
// const bucket = storage.bucket()

// export async function uploadAvatarToFirebase(avatar: UploadedFile, userId: number) {
//   const firebasePath = `avatars/${userId}/${uuid() + avatar.name}`
//   await bucket.upload(avatar.tempFilePath, {
//     destination: firebasePath
//   })
//   const fileRef = bucket.file(firebasePath)
//   const [url] = await fileRef.getSignedUrl({
//     action: 'read',
//     expires: '03-01-2500', // Specify the desired expiration date or duration
//   });
//   console.log('avatarurl = ' + url)
//   return url
// }

// export async function uploadCommentFileToFirebase(avatar: UploadedFile) {
//   const firebasePath = `comment-files/${uuid() + avatar.name}`
//   await bucket.upload(avatar.tempFilePath, {
//     destination: firebasePath
//   })
//   const fileRef = bucket.file(firebasePath)
//   const [url] = await fileRef.getSignedUrl({
//     action: 'read',
//     expires: '03-01-2500', // Specify the desired expiration date or duration
//   });
//   console.log('comment file url = ' + url)
//   return url
// }



// export async function deleteAvatarFromFirebase(userId: number) {
//   const [files] = await bucket.getFiles({ prefix: `avatars/${userId}` })
//   await files[0]?.delete()
// }