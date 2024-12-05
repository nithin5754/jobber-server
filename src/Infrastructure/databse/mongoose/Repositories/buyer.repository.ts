import { Model } from 'mongoose';
import { Buyer, BuyerParams, IBuyer, IBuyerDocument } from '../../../../Domain/Entities/Buyer';
import { IBuyerRepositories } from '../../../../Domain/interface/ibuyer.repository';
import { IRepoResponse, IRepoRequest } from '../../../../shared/ibase-repository';

export class BuyerRepositories implements IBuyerRepositories {
  constructor(private buyerModal: Model<IBuyerDocument>) {}
  public async create(data: IRepoRequest): Promise<IRepoResponse> {
    const result: IBuyerDocument | null = await this.buyerModal.create(data.buyer);

 
    return result ? { buyer: this.filterFetchResult(result) } : { isNull: true };
  }
  public async findOne(criteria: IRepoRequest): Promise<IRepoResponse> {
    let result: IBuyerDocument[] | null = await this.buyerModal
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
          buyer: this.filterFetchResult(result[0])
        }
      : { isNull: true };
  }
  update(id: string, data: IRepoRequest): Promise<IRepoResponse> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async getRandomBuyers({count}: IRepoRequest): Promise<IRepoResponse> { 


    let result: IBuyerDocument[] | null = await this.buyerModal
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
    buyerArray: this.filterFetchResultArray(result)
  }
: { isNull: true }



  }

  public async updateUsingOtherFields({ buyerFilter, buyer }: IRepoRequest): Promise<IRepoResponse> {
    const isUpdate = await this.buyerModal.findOneAndUpdate(buyerFilter, { $set: buyer });
    return { isUpdate: !!isUpdate };
  }

  private filterFetchResult(data: IBuyerDocument): Buyer {
    return new Buyer(data as BuyerParams);
  }


  private filterFetchResultArray(data:IBuyerDocument[]):Buyer[] {
     let buyerArray:IBuyer[]=[]
      for (let i = 0; i < data.length; i++) {
         buyerArray.push(new Buyer(data[i] as BuyerParams))
        
        }
        return buyerArray
  }




}
