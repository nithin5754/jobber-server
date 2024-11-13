import moment from 'moment';
import { IBuyer, IBuyerDocument } from '../../../../Entities/Buyer';
import { IBuyerRepository } from '../../../../Interfaces/IBuyerRepo';

import { BuyerModal } from '../models/buyer.schema';




export class BuyerRepository implements IBuyerRepository {
  
  private filterDataFromBuyerDb = (data: IBuyerDocument | IBuyerDocument[] | null, type: 'single' | 'array'): IBuyer | IBuyer[] | null => {
    if (data && type == 'single' && !Array.isArray(data)) {
      let filterData: IBuyer = {
        id: data._id?.toString() as string,
        email: data.email,
        username: data.username,
        country: data.country,
        isSeller: data.isSeller,
        profilePicture: data.profilePicture,
        purchasedGigs: data.purchasedGigs,
        createdAt: moment(data.createdAt).format('MMMM D, YYYY - h:mm A'),
        updatedAt: moment(data.updatedAt).format('MMMM D, YYYY - h:mm A')
      };
  
      return filterData;
    } else if (data && type === 'array' && Array.isArray(data)) {
      let filterData: IBuyer[] = data.map((res: IBuyerDocument) => ({
        id: res._id?.toString() as string,
        email: res.email,
        username: res.username,
        country: res.country,
        isSeller: res.isSeller,
        profilePicture: res.profilePicture,
        purchasedGigs: res.purchasedGigs,
        createdAt: moment(res.createdAt).format('MMMM D, YYYY - h:mm A'),
        updatedAt: moment(res.updatedAt).format('MMMM D, YYYY - h:mm A')
      }));
  
      return filterData;
    } else {
      return null;
    }
  };

  constructor() {}

  async buyerByEmail(email: string): Promise<IBuyer | null> {
    let result: IBuyerDocument[] | null = await BuyerModal.aggregate([
      {$match:{'userId':{$exists:true}}
      },
      {
        $lookup:{
          from:'users',
          localField:'userId',
          foreignField:'_id',
          as:'user'
        },
      },
      {
        $unwind: '$user'
      },
      {
        $match:{'user.email':email}
      },
      {  
        $lookup:{
          from:'gigs',
          localField:'purchasedGigs',
          foreignField:'_id',
          as:'projectGigs'
        },
      },

      {
        $project:{
          id: '$_id', 
          username:'$user.username',
          email:'$user.email',
          country:'$user.country',
          profilePicture:'$user.profilePicture',
          purchasedGigs:'$projectGigs',
          isSeller:1,
          createdAt:1,
          updatedAt:1
        }
      }
    ]).exec()

    console.log(result,"buyer by email")

    return this.filterDataFromBuyerDb(result[0], 'single') as IBuyer | null;
  }
  async buyerByUsername(username: string): Promise<IBuyer | null> {
    let result: IBuyerDocument | null = await BuyerModal.findOne({ username });

    return this.filterDataFromBuyerDb(result, 'single') as IBuyer | null;
  }
}
