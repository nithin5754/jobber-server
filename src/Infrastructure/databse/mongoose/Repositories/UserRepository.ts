import { Model } from 'mongoose';
import { IUser, User, UserParams } from '../../../../Domain/Entities/User';
import { UserDocuments } from '../../../../Domain/interface/Iuser';
import { IUserRepository } from '../../../../Domain/interface/IUserRepository';
import { IRepoRequest, IRepoResponse } from '../../../../shared/IBaseRepository';
import { BuyerRepositories } from './BuyerRepositories';

export class UserRepository implements IUserRepository {
  constructor(private readonly model: Model<UserDocuments>, private readonly buyerservice: BuyerRepositories) {}
  public async isUsernameOrEmailExist(username: string, email: string): Promise<{ username: boolean; email: boolean }> {
    const result: UserDocuments[] | null = await this.model.find({ username, email });

    const isEmailExist: boolean = result.some((user: UserDocuments) => user.email === email);
    const isUserNameExist: boolean = result.some((user: UserDocuments) => user.username === username);

    return { email: isEmailExist, username: isUserNameExist };
  }
  public async updateUsingOtherFields({ filter, data }: IRepoRequest): Promise<IRepoResponse> {
    const isUpdate = await this.model.findByIdAndUpdate(filter, { $set: data });
    return { isUpdate: !!isUpdate };
  }
  public async create(data: IRepoRequest): Promise<IRepoResponse> {
    const result: UserDocuments | null = await this.model.create(data.data);

    if (result) {
      const buyerInitialDetails = {
        userId: result._id,
        purchasedGigs: []
      };

      await this.buyerservice.create({ buyer: buyerInitialDetails });
    }

    return result ? { user: this.filterFetchResult(result) } : { isNull: true };
  }
  public async findOne(criteria: IRepoRequest): Promise<IRepoResponse> {
    const result: UserDocuments | null = await this.model.findOne(criteria.data);
   

    return result ? {user: this.filterFetchResult(result) } : { isNull: true };
  }

  public async update(id: string, data: IRepoRequest): Promise<IRepoResponse> {
    const isUpdate = await this.model.findByIdAndUpdate({ _id: id }, { $set: data.data }, { upsert: true });

    return { isUpdate: !!isUpdate };
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  private filterFetchResult(data: UserDocuments): User {




           
    return new User(data as UserParams);
  }
}
