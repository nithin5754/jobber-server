import { DeleteResult} from 'mongoose';
import { SellerGig } from '../../../Entities/gig.entity';
import { ISellerGigParams, SellerGigDocument } from '../../../Interface/IGig.interface';

import { IRepoRequest, IRepoResponse } from '../../../IBaseRepositories';
import { GigModel } from '../Models/gig.schema';




export async function createGIG(data: IRepoRequest): Promise<IRepoResponse> {
    const createdGig: SellerGigDocument = await GigModel.create(data.gig);

    return {
      gig: convertToGigData(createdGig) || undefined,
      isNull:(createdGig&& convertToGigData(createdGig))?false: true
    };
  }
export async function findOneGIG(criteria: IRepoRequest): Promise<IRepoResponse> {
    const result: SellerGigDocument | null = await GigModel.findOne(criteria.gig).exec();

   

    return {
      gig: result ? convertToGigData(result) : undefined,
      isNull: result&& convertToGigData(result)?false:true
    };
  }


export async function findGIG(criteria: IRepoRequest): Promise<IRepoResponse> {

     const result: SellerGigDocument[]  = await GigModel.find(
      criteria.gig?criteria.gig:{} )
   
 
      return{
        gigArray:convertToGigDataArray(result),
        isNull:result?false:true
      }
 
  }


  
export async function findByLimitGIG(criteria: IRepoRequest,limit:number): Promise<IRepoResponse> {

  
    const result: SellerGigDocument[]  = await GigModel.find(
      criteria.gig?criteria.gig:{} ).limit(limit??0)
      

      
      return{
       gigArray:convertToGigDataArray(result),
       isNull:result?false:true
     }

 }

export async function updateGIG(id: string, data: IRepoRequest): Promise<IRepoResponse> {
   

    
    const document: SellerGigDocument | null = await GigModel.findOneAndUpdate(
      { _id: id },
      {
        $set: data.gig
      },
      { new: true }
    ).exec();



    return {
      isNull: document === null || !document ? true : false,
      gig:document?convertToGigData(document):undefined
    };
  }


  export async function deleteGigById(id:string):Promise<boolean> {
    const result: DeleteResult = await GigModel.deleteOne({ _id: id }).exec();
    return !!result;
  }


export async function deleteGig(criteria: IRepoRequest): Promise<boolean> {
    const result: DeleteResult = await GigModel.deleteOne(criteria.gig).exec();
    return !!result;
  }


export async function countGig():Promise<number>{
    return await GigModel.countDocuments().exec()
  }

  function convertToGigData(data: ISellerGigParams): SellerGig {
    return new SellerGig(data);
  }


  function convertToGigDataArray(data: ISellerGigParams[]): SellerGig[] {
    let gigArray:SellerGig[]=[]

    for (let i = 0; i < data.length; i++) {
    gigArray.push(new SellerGig(data[i]))
      
    }

    return gigArray
  }

