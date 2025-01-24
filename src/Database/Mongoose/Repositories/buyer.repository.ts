
import { Buyer, BuyerParams, IBuyer, IBuyerDocument } from '../../../Entities/Buyer';
import { IRepoRequest, IRepoResponse } from '../../../IBaseRepositories';
import { BuyerModal } from '../Models/buyer.schema';




export async function createBuyer(data: IRepoRequest): Promise<IRepoResponse> {
    const result: IBuyerDocument | null = await BuyerModal.create(data.buyer);

 
    return result ? { buyer:filterFetchResult(result) } : { isNull: true };
  }
export async function findOneBuyer(criteria: IRepoRequest): Promise<IRepoResponse> {
    let result: IBuyerDocument[] | null = await BuyerModal
      .aggregate([
        { $match: { userId: { $exists: true } } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $match: {
            [criteria.buyer?._id ? 'user._id' : criteria.buyer?.email ? 'user.email' : 'user.username']:
              criteria.buyer?._id || criteria.buyer?.username || criteria.buyer?.email
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'purchasedGigs',
            foreignField: '_id',
            as: 'projectGigs'
          }
        },

        {
          $project: {
            userId: '$user._id',
            username: '$user.username',
            email: '$user.email',
            country: '$user.country',
            profilePicture: '$user.profilePicture',
            purchasedGigs: '$projectGigs',
            isSeller: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ])
      .exec();

    return result
      ? {
          buyer:filterFetchResult(result[0])
        }
      : { isNull: true };
  }


export async function getRandomBuyers({count}: IRepoRequest): Promise<IRepoResponse> { 


    let result: IBuyerDocument[] | null = await BuyerModal
      .aggregate([
        { $match: { userId: { $exists: true } } },
        { $sample: { size: count?count:10 } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'purchasedGigs',
            foreignField: '_id',
            as: 'projectGigs'
          }
        },

        {
          $project: {
            userId: '$user._id',
            username: '$user.username',
            email: '$user.email',
            country: '$user.country',
            profilePicture: '$user.profilePicture',
            purchasedGigs: '$projectGigs',
            isSeller: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ])
      .exec();


console.log("buyerarray",result)

return result
? {
    buyerArray:filterFetchResultArray(result)
  }
: { isNull: true }



  }

export async function updateUsingOtherFieldsBuyer({ buyerFilter, buyer }: IRepoRequest): Promise<IRepoResponse> {
    const isUpdate = await BuyerModal.findOneAndUpdate(buyerFilter, { $set: buyer });
    return { isUpdate: !!isUpdate };
  }

  function filterFetchResult(data: IBuyerDocument): Buyer {
    return new Buyer(data as BuyerParams);
  }


  function filterFetchResultArray(data:IBuyerDocument[]):Buyer[] {
     let buyerArray:IBuyer[]=[]
      for (let i = 0; i < data.length; i++) {
         buyerArray.push(new Buyer(data[i] as BuyerParams))
        
        }
        return buyerArray
  }





