import { Model } from 'mongoose';
import { ISellerDocument } from '../../../../Domain/interface/ISeller.interface';
import { ISellerRepositories } from '../../../../Domain/interface/ISeller.respositorory';
import { IRepoRequest, IRepoResponse } from '../../../../shared/IBase-repository';
import { Seller } from '../../../../Domain/Entities/seller.entity';
import { BadRequestError } from '../../../../Presentation/error/error.interface';

export class SellerRepository implements ISellerRepositories {
  constructor(private readonly sellerDataBase: Model<ISellerDocument>) {}
  public async create(data: IRepoRequest): Promise<IRepoResponse> {
    try {
      const seller: ISellerDocument | undefined = await this.sellerDataBase.create(data.seller);

      return seller
        ? {
            seller: this.fetchFilterData(seller)
          }
        : {
            isNull: true
          };
    } catch (error: any) {
      throw new BadRequestError(error, 'Create Seller() db error');
    }
  }

  

  public async findOne(criteria: IRepoRequest): Promise<IRepoResponse> {
    const seller: ISellerDocument | null = await this.sellerDataBase.findOne(criteria.seller);

    return seller ? { seller: this.fetchFilterData(seller) } : { isNull: true };
  }
  public async update(id: string, seller: IRepoRequest): Promise<IRepoResponse> {
    const result: ISellerDocument | null = await this.sellerDataBase.findByIdAndUpdate(id, { $set: seller }, { new: true });
    return result
      ? {
          seller: this.fetchFilterData(result)
        }
      : {
          isNull: true
        };
  }

  public async updateUsingOtherFilter({ sellerFilter, seller }: IRepoRequest): Promise<IRepoResponse> {
    const result: ISellerDocument | null = await this.sellerDataBase.findOneAndUpdate(
      sellerFilter,
      {
        $set: {
          fullName: seller?.fullName!,
          profilePicture: seller?.profilePicture,
          description: seller?.description,
          skills: seller?.skills,
          oneliner: seller?.oneliner,
          languages: seller?.languages,
          responseTime: seller?.responseTime,
          experience: seller?.experience,
          education: seller?.education,
          socialLinks: seller?.socialLinks,
          certificates: seller?.certificates
        }
      },
      { new: true }
    );
    return result
      ? {
          seller: this.fetchFilterData(result)
        }
      : {
          isNull: true
        };
  }

  public async randomSellers(size: number): Promise<IRepoResponse> {
    const sellers: ISellerDocument[] = await this.sellerDataBase.aggregate([{ $sample: { size } }]);

    return sellers && sellers.length > 0
      ? {
          sellerArray: this.fetchDataArray(sellers)
        }
      : {
          isNull: true
        };
  }

 public async find(): Promise<IRepoResponse> {
  const sellers: ISellerDocument[] = await this.sellerDataBase.find();

  return sellers && sellers.length > 0
    ? {
        sellerArray: this.fetchDataArray(sellers)
      }
    : {
        isNull: true
      };
  }

  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  private fetchFilterData(data: ISellerDocument): Seller {
    return new Seller(data);
  }

  private fetchDataArray(data: ISellerDocument[]): Seller[] {
    let sellersArray: Seller[] = [];
    for (let i = 0; i < data.length; i++) {
      sellersArray.push(this.fetchFilterData(data[i]));
    }

    return sellersArray;
  }
}
