import { IMulterConverter } from "./imulter-convertor.interface"







export class MulterFileConverter implements IMulterConverter {
  convertFileToString(file: Express.Multer.File):string{
    
    const b64=Buffer.from(file.buffer).toString('base64')
    let dataURI:string="data:"+file.mimetype+";base64,"+b64

    return dataURI
        
  }

}