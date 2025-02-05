
import { ISellerGigParams } from '../../../Interface/IGig.interface';
import { SellerGig } from '../../../Entities/Gig';
import { IRepoRequest, IRepoResponse } from '../../../IBaseRepositories';
import { GigModel } from '../Models/gig.schema';


let filter: any = {};


  
 export async function searchGigs(criteria: IRepoRequest): Promise<IRepoResponse> {
 filter={}
filterQuery(criteria.query as string);

priceFilter(criteria.gig_filter?.min_price,criteria.gig_filter?.max_price)
deliveryTime(criteria.gig_filter?.delivery_time )



 const result=await GigModel.find(filter);




    return {
      gigArray: result &&convertToGigDataArray(result),
      isNull: true
    };
  }



 export async function getMoreLikeThisSearch(criteria:IRepoRequest):Promise<IRepoResponse>{


    const result = await GigModel.find({
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
      gigArray: result &&convertToGigDataArray(result),
      isNull: true
    };

    
  }




  function priceFilter(min_price: string | null|undefined, max_price: string | null|undefined): void {
    if (min_price&&typeof min_price==='string') {
   filter.price = { ...filter.price, $gte: parseInt(min_price as string, 10) };
    }

    if (max_price&&typeof max_price==='string') {
   filter.price = { ...filter.price, $lte: parseInt(max_price as string, 10) };
    }
  }



  function filterQuery(query: string): void {
    const searchRegex = { $regex: query, $options: 'i' };
 filter.$or = [
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

  function deliveryTime(delivery_time: string | null | undefined): void {
    if (delivery_time) {
      const value = parseInt(delivery_time, 10);
   filter.expectedDelivery = {
        $regex: new RegExp(`^(${value}) Days Delivery$`, 'i')
      };
    
    }

  }
  

  function convertToGigDataArray(data: ISellerGigParams[]): SellerGig[] {
    let gigArray: SellerGig[] = [];

    for (let i = 0; i < data.length; i++) {
      gigArray.push(new SellerGig(data[i]));
    }

    return gigArray;
  }

