import { floor, random, sample, sampleSize } from 'lodash';
import { Buyer } from '../../../Domain/Entities/Buyer';
import { Seller } from '../../../Domain/Entities/seller.entity';
import { IEducation, IExperience, ISeller } from '../../../Domain/Interface/ISeller.interface';
import { BuyerRepositories } from '../../../Infrastructure/Databse/Mongoose/Repositories/buyer.repository';
import { SellerRepository } from '../../../Infrastructure/Databse/Mongoose/Repositories/seller.respository';
import { BadRequestError } from '../../../Presentation/Error/error.interface';
import { IRepoResponse } from '../../../Shared/IBaseRepository';
import { IUseCase } from '../../../Shared/IUsecase';
import { faker } from '@faker-js/faker';
import { UserRepository } from '../../../Infrastructure/Databse/Mongoose/Repositories/user.respository';
export interface ISellerSeedDTO {
  size: number;
}

export interface ISellerSeedResult {
  iSucess: boolean;
}

export class SeedSellersUsecase implements IUseCase<ISellerSeedDTO, ISellerSeedResult> {
  constructor(
    private readonly buyerService: BuyerRepositories,
    private readonly sellerService: SellerRepository,
    private readonly userservice: UserRepository
  ) {}

  public async execute(input: ISellerSeedDTO): Promise<ISellerSeedResult> {
    const { size } = input;

    const buyers: Buyer[] = await this.getRandomBuyers(size);

    const isAdd: boolean = await this.addSellersToBuyersIfNotExist(buyers);

    return {
      iSucess: isAdd
    };
  }

  private async getRandomBuyers(count: number): Promise<Buyer[]> {
    const buyers: IRepoResponse = await this.buyerService.getRandomBuyers({ count: parseInt(`${count}`, 10) });

    if (!buyers || buyers.isNull || !buyers.buyerArray || buyers.buyerArray.length < 1) {
      throw new BadRequestError('Not Found', 'SeedSellersUsecase seller() method error');
    }

    return buyers.buyerArray;
  }

  private async addSellersToBuyersIfNotExist(buyers: Buyer[]): Promise<boolean> {
    for (let i = 0; i < buyers.length; i++) {
      const buyer: Buyer = buyers[i];

      const checkIfSellerExist: Seller | null = await this.isSellerExist(buyer.email as string);

      if (checkIfSellerExist) {
        throw new BadRequestError('Seller already exist.', 'SeedSellersUsecase seller() method error');
      }

      const create: ISeller = this.newSellerData(buyer);

      const result: IRepoResponse = await this.sellerService.create({ seller: create });

      if (!result || !result.seller || result.isNull) {
        throw new BadRequestError('Error Occurred Creating Seller Profile', 'CreateSellerUseCase() validation error');
      }

      await this.buyerService.updateUsingOtherFields({ buyerFilter: { userId: result.seller.userId }, buyer: { isSeller: true } });

      await this.addUserDetails(result.seller);
    }

    return true;
  }

  private async isSellerExist(email: string): Promise<Seller | null> {
    const result: IRepoResponse = await this.sellerService.findOne({ seller: { email: `${email}` } });

    return result.seller ?? null;
  }

  private basicDescription(): string {
    return faker.commerce.productDescription();
  }

  private skills(): string[] {
    return [
      'Programming',
      'Web development',
      'Mobile development',
      'Proof reading',
      'UI/UX',
      'Data Science',
      'Financial modeling',
      'Data analysis'
    ];
  }

  private certificates(): { name: string; from: string; year: number }[] {
    return [
      {
        name: 'Flutter App Developer',
        from: 'Flutter Academy',
        year: 2021
      },
      {
        name: 'Android App Developer',
        from: '2019',
        year: 2020
      },
      {
        name: 'IOS App Developer',
        from: 'Apple Inc.',
        year: 2019
      }
    ];
  }

  private newSellerData(buyer: Buyer): ISeller {
    const seller: ISeller = {
      fullName: faker.person.fullName(),
      userId: buyer.userId,
      description: this.basicDescription().length <= 250 ? this.basicDescription() : this.basicDescription().slice(0, 250),
      oneliner: faker.word.words({ count: { min: 5, max: 10 } }),
      skills: sampleSize(this.skills(), sample([1, 4])),
      languages: [
        { language: 'English', level: 'Native' },
        { language: 'Spnish', level: 'Basic' },
        { language: 'German', level: 'Basic' }
      ],
      responseTime: parseInt(faker.commerce.price({ min: 1, max: 5, dec: 0 })),
      experience: this.randomExperiences(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
      education: this.randomEducation(parseInt(faker.commerce.price({ min: 2, max: 4, dec: 0 }))),
      socialLinks: ['https://kickchatapp.com', 'http://youtube.com', 'https://facebook.com'],
      certificates: this.certificates()
    };

    return seller;
  }

  private async addUserDetails(seller: Seller): Promise<void> {
    const userDetails: IRepoResponse = await this.userservice.findOne({ data: { _id: seller.userId } });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `SeedSellersUsecase() Not Found by `);
    }

    seller.username = userDetails.user?.username;
    seller.profilePicture = userDetails.user?.profilePicture;
    seller.profilePublicId = userDetails.user?.profilePublicId;
    seller.country = userDetails.user?.country as string;
    seller.email = userDetails.user?.email;
  }

  private randomExperiences(count: number): IExperience[] {
    const result: IExperience[] = [];
    for (let i = 0; i < count; i++) {
      const randomStartYear = [2020, 2021, 2022, 2023, 2024, 2025];
      const randomEndYear = ['Present', '2024', '2025', '2026', '2027'];
      const endYear = randomEndYear[floor(random(0.9) * randomEndYear.length)];
      const experience = {
        company: faker.company.name(),
        title: faker.person.jobTitle(),
        startDate: `${faker.date.month()} ${randomStartYear[floor(random(0.9) * randomStartYear.length)]}`,
        endDate: endYear === 'Present' ? 'Present' : `${faker.date.month()} ${endYear}`,
        description: faker.commerce.productDescription().slice(0, 100),
        currentlyWorkingHere: endYear === 'Present'
      };
      result.push(experience);
    }
    return result;
  }

  private randomEducation(count: number): IEducation[] {
    const result: IEducation[] = [];
    for (let i = 0; i < count; i++) {
      const randomYear = [2020, 2021, 2022, 2023, 2024, 2025];
      const education = {
        country: faker.location.country(),
        university: faker.person.jobTitle(),
        title: faker.person.jobTitle(),
        major: `${faker.person.jobArea()} ${faker.person.jobDescriptor()}`,
        year: `${randomYear[floor(random(0.9) * randomYear.length)]}`
      };
      result.push(education);
    }
    return result;
  }
}
