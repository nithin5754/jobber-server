import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";



export interface ICloudinary {

   uploads(file:string,public_id?:string,overWrite?:boolean,invalidate?:boolean):Promise<UploadApiResponse|UploadApiErrorResponse|undefined>
}