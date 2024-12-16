import { DeleteResult, Model } from 'mongoose';
import { SellerGig } from '../../../../Domain/Entities/gig.entity';
import { ISellerGigParams, SellerGigDocument } from '../../../../Domain/interface/igig.interface';
import { IGigRepository } from '../../../../Domain/interface/igig.repository';

import { IRepoRequest, IRepoResponse } from '../../../../shared/ibase-repository';


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


    // const result: SellerGigDocument[]  = await this.gig_model.aggregate([
    //   { $match: criteria.gig?criteria.gig:{} }])

     const result: SellerGigDocument[]  = await this.gig_model.find(
      criteria.gig?criteria.gig:{} )
   
  
      return{
        gigArray:this.convertToGigDataArray(result),
        isNull:result?false:true
      }
 
  }

  public async update(id: string, data: IRepoRequest): Promise<IRepoResponse> {
    if (!data.gig) {
      return {
        isUpdate: false,
        isNull: true
      };
    }
    const document: SellerGigDocument | null = await this.gig_model.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          title: data.gig.title,
          description: data.gig.description,
          categories: data.gig.categories,
          subCategories: data.gig.subCategories,
          tags: data.gig.tags,
          price: data.gig.price,
          coverImage: data.gig.coverImage,
          expectedDelivery: data.gig.expectedDelivery,
          basicTitle: data.gig.basicTitle,
          basicDescription: data.gig.basicDescription
        }
      },
      { new: true }
    ).exec();

    return {
      isUpdate: !!document,
      isNull: document === null || !document ? true : false
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
