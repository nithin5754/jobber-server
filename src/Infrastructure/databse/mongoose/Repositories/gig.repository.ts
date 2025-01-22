import { DeleteResult, Model } from 'mongoose';
import { SellerGig } from '../../../../Domain/Entities/gig.entity';
import { ISellerGigParams, SellerGigDocument } from '../../../../Domain/interface/IGig.interface';
import { IGigRepository } from '../../../../Domain/interface/IGig.repository';
import { IRepoRequest, IRepoResponse } from '../../../../Shared/IBase-repository';




export class GigRepository implements IGigRepository {
  constructor(private readonly gig_model: Model<SellerGigDocument>) {}
  public async create(data: IRepoRequest): Promise<IRepoResponse> {
    const createdGig: SellerGigDocument = await this.gig_model.create(data.gig);

    return {
      gig: this.convertToGigData(createdGig) || undefined,
      isNull:(createdGig&& this.convertToGigData(createdGig))?false: true
    };
  }
  public async findOne(criteria: IRepoRequest): Promise<IRepoResponse> {
    const result: SellerGigDocument | null = await this.gig_model.findOne(criteria.gig).exec();

   

    return {
      gig: result ? this.convertToGigData(result) : undefined,
      isNull: result&& this.convertToGigData(result)?false:true
    };
  }


  public async find(criteria: IRepoRequest): Promise<IRepoResponse> {

     const result: SellerGigDocument[]  = await this.gig_model.find(
      criteria.gig?criteria.gig:{} )
   
 
      return{
        gigArray:this.convertToGigDataArray(result),
        isNull:result?false:true
      }
 
  }


  
  public async findByLimit(criteria: IRepoRequest,limit:number): Promise<IRepoResponse> {

  
    const result: SellerGigDocument[]  = await this.gig_model.find(
      criteria.gig?criteria.gig:{} ).limit(limit??0)
      

      
      return{
       gigArray:this.convertToGigDataArray(result),
       isNull:result?false:true
     }

 }

  public async update(id: string, data: IRepoRequest): Promise<IRepoResponse> {
   

    
    const document: SellerGigDocument | null = await this.gig_model.findOneAndUpdate(
      { _id: id },
      {
        $set: data.gig
      },
      { new: true }
    ).exec();



    return {
      isNull: document === null || !document ? true : false,
      gig:document?this.convertToGigData(document):undefined
    };
  }
  public async delete(id: string): Promise<boolean> {
    const result: DeleteResult = await this.gig_model.deleteOne({ _id: id }).exec();
    return !!result;
  }


  public async deleteGig(criteria: IRepoRequest): Promise<boolean> {
    const result: DeleteResult = await this.gig_model.deleteOne(criteria.gig).exec();
    return !!result;
  }


  public async countGig():Promise<number>{
    return await this.gig_model.countDocuments().exec()
  }

  private convertToGigData(data: ISellerGigParams): SellerGig {
    return new SellerGig(data);
  }


  private convertToGigDataArray(data: ISellerGigParams[]): SellerGig[] {
    let gigArray:SellerGig[]=[]

    for (let i = 0; i < data.length; i++) {
    gigArray.push(new SellerGig(data[i]))
      
    }

    return gigArray
  }
}
