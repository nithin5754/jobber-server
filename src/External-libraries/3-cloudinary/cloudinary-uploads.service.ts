import cloudinary, {
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { ICloudinary } from "./icoudinary.interface";


export class CloudinaryUploads implements ICloudinary {
  constructor() {}
  uploads(
    file: string,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return new Promise((resolve) => {
      cloudinary.v2.uploader.upload(
        file,
        {
          public_id,
          overwrite,
          invalidate,
          resource_type: 'auto' // zip, images
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) resolve(error);
          resolve(result);
        }
      );
    });
  }
}
