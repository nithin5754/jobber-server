import { Model } from 'mongoose';
import { ISellerGigParams, SellerGigDocument } from '../../../../Domain/interface/igig.interface';
import { SellerGig } from '../../../../Domain/Entities/gig.entity';
import { IRepoRequest, IRepoResponse } from '../../../../shared/ibase-repository';

export class Search {
  private filter: any = {};
  private moreLikeFilter:any={}

  constructor(private readonly gig_model: Model<SellerGigDocument>) {}
  
  public async searchGigs(criteria: IRepoRequest): Promise<IRepoResponse> {
    this.filter={}
 this.filterQuery(criteria.query as string);

 this.priceFilter(criteria.gig_filter?.min_price,criteria.gig_filter?.max_price)
 this.deliveryTime(criteria.gig_filter?.delivery_time )



 const result=await this.gig_model.find(this.filter);




    return {
      gigArray: result && this.convertToGigDataArray(result),
      isNull: true
    };
  }



  public async getMoreLikeThis(criteria:IRepoRequest):Promise<IRepoResponse>{


    const result = await this.gig_model.find({
      $and: [
        {
          $or: [
            { basicDescription: { $regex: criteria.gig_moreLike_filter?.basicDescription, $options: 'i' } },
            { expectedDelivery: { $regex: criteria.gig_moreLike_filter?.expectedDelivery, $options: 'i' } },
            { categories: { $in: criteria.gig_moreLike_filter?.categories } }
          ]
        },
        {
          _id: { $ne: criteria.gig_moreLike_filter?.id }  
        }
      ]
    });

    
 
    


    return {
      gigArray: result && this.convertToGigDataArray(result),
      isNull: true
    };

    
  }




  private priceFilter(min_price: string | null|undefined, max_price: string | null|undefined): void {
    if (min_price&&typeof min_price==='string') {
      this.filter.price = { ...this.filter.price, $gte: parseInt(min_price as string, 10) };
    }

    if (max_price&&typeof max_price==='string') {
      this.filter.price = { ...this.filter.price, $lte: parseInt(max_price as string, 10) };
    }
  }



  private filterQuery(query: string): void {
    const searchRegex = { $regex: query, $options: 'i' };
    this.filter.$or = [
      { title: searchRegex },
      { username: searchRegex },
      { description: searchRegex },
      { basicTitle: searchRegex },
      { basicDescription: searchRegex },
      { categories: searchRegex },
      { subCategories: searchRegex },
      { tags: searchRegex }
    ];
  }

  private deliveryTime(delivery_time: string | null | undefined): void {
    if (delivery_time) {
      const value = parseInt(delivery_time, 10);
      this.filter.expectedDelivery = {
        $regex: new RegExp(`^(${value}) Days Delivery$`, 'i')
      };
    
    }

  }
  

  private convertToGigDataArray(data: ISellerGigParams[]): SellerGig[] {
    let gigArray: SellerGig[] = [];

    for (let i = 0; i < data.length; i++) {
      gigArray.push(new SellerGig(data[i]));
    }

    return gigArray;
  }
}
