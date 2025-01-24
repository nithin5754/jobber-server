
import { ISellerDocument } from '../../../../Domain/Interface/ISeller.interface';
import { Seller } from '../../../../Domain/Entities/seller.entity';
import { BadRequestError } from '../../../../Presentation/Error/errorInterface';
import { IRepoRequest, IRepoResponse } from '../../../../IBaseRepositories';
import { SellerModel } from '../Models/seller.schema';


  export async function createSeller(data: IRepoRequest): Promise<IRepoResponse> {
    try {
      const seller: ISellerDocument | undefined = await SellerModel.create(data.seller);

      return seller
        ? {
            seller:fetchFilterData(seller)
          }
        : {
            isNull: true
          };
    } catch (error: any) {
      throw new BadRequestError(error, 'Create Seller() db error');
    }
  }

  

  export async function findOneSeller(criteria: IRepoRequest): Promise<IRepoResponse> {
    const seller: ISellerDocument | null = await SellerModel.findOne(criteria.seller);

    return seller ? { seller:fetchFilterData(seller) } : { isNull: true };
  }
  export async function updateSeller(id: string, seller: IRepoRequest): Promise<IRepoResponse> {
    const result: ISellerDocument | null = await SellerModel.findByIdAndUpdate(id, { $set: seller }, { new: true });
    return result
      ? {
          seller:fetchFilterData(result)
        }
      : {
          isNull: true
        };
  }

  export async function updateUsingOtherFilterSeller({ sellerFilter, seller }: IRepoRequest): Promise<IRepoResponse> {
    const result: ISellerDocument | null = await SellerModel.findOneAndUpdate(
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
          seller:fetchFilterData(result)
        }
      : {
          isNull: true
        };
  }

  export async function randomSellers(size: number): Promise<IRepoResponse> {
    const sellers: ISellerDocument[] = await SellerModel.aggregate([{ $sample: { size } }]);

    return sellers && sellers.length > 0
      ? {
          sellerArray:fetchDataArray(sellers)
        }
      : {
          isNull: true
        };
  }

 export async function findSeller(): Promise<IRepoResponse> {
  const sellers: ISellerDocument[] = await SellerModel.find();

  return sellers && sellers.length > 0
    ? {
        sellerArray:fetchDataArray(sellers)
      }
    : {
        isNull: true
      };
  }


function fetchFilterData(data: ISellerDocument): Seller {
    return new Seller(data);
  }

function fetchDataArray(data: ISellerDocument[]): Seller[] {
    let sellersArray: Seller[] = [];
    for (let i = 0; i < data.length; i++) {
      sellersArray.push(fetchFilterData(data[i]));
    }

    return sellersArray;
  }
// }
