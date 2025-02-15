import { User, UserParams } from '../../../Entities/User';
import { UserDocuments } from '../../../Interface/IUser.interface';

import { IRepoRequest, IRepoResponse } from '../../../IBaseRepositories';
import { UserModal } from '../Models/user.schema';
import { BuyerModal } from '../Models/buyer.schema';

export async function isUsernameOrEmailExist(username: string, email: string): Promise<{ username: boolean; email: boolean }> {
  const result: UserDocuments[] | null = await UserModal.find({ username, email });

  const isEmailExist: boolean = result.some((user: UserDocuments) => user.email === email);
  const isUserNameExist: boolean = result.some((user: UserDocuments) => user.username === username);

  return { email: isEmailExist, username: isUserNameExist };
}
export async function updateUsingOtherFieldsUser({ filter, data }: IRepoRequest): Promise<IRepoResponse> {
  const isUpdate = await UserModal.findByIdAndUpdate(filter, { $set: data });
  return { isUpdate: !!isUpdate };
}
export async function createUser(data: IRepoRequest): Promise<IRepoResponse> {
  const result: UserDocuments | null = await UserModal.create(data.data);

  if (result) {
    const buyerInitialDetails = {
      userId: result._id,
      purchasedGigs: []
    };

    await BuyerModal.create(buyerInitialDetails);
  }

  return result ? { user: filterFetchResult(result) } : { isNull: true };
}
export async function findOneByUser(criteria: IRepoRequest): Promise<IRepoResponse> {
  const result: UserDocuments | null = await UserModal.findOne(criteria.data);

  return result ? { user: filterFetchResult(result) } : { isNull: true };
}

export async function updateUser(id: string, data: IRepoRequest): Promise<IRepoResponse> {
  const isUpdate = await UserModal.findByIdAndUpdate({ _id: id }, { $set: data.data }, { upsert: true });

  return { isUpdate: !!isUpdate };
}

export function filterFetchResult(data: UserDocuments): User {
  return new User(data as UserParams);
}
