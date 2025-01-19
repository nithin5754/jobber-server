import { faker } from '@faker-js/faker';
import { ISellerGig } from '../../../Domain/interface/igig.interface';

import { IUseCase } from '../../../shared/IUsecase';
import { sample } from 'lodash';

import { IRepoResponse } from '../../../shared/IBase-repository';
import { GigRepository } from '../../../Infrastructure/databse/mongoose/Repositories/gig.repository';

import { Seller } from '../../../Domain/Entities/seller.entity';
import { SellerRepository } from '../../../Infrastructure/databse/mongoose/Repositories/seller.respository';

export interface ISellerGigSeedDTO {}

export interface ISellerGigSeedResult {}

export class GigSeedUsecases implements IUseCase<ISellerGigSeedDTO, ISellerGigSeedResult> {
  constructor(private readonly gigService: GigRepository, private readonly sellerService: SellerRepository) {}
  public async execute(input: ISellerGigSeedDTO): Promise<ISellerGigSeedResult> {
    const seller: IRepoResponse = await this.sellerService.find();

    console.log("sellers",seller.sellerArray?.length)

    if (seller && seller.sellerArray) {
      await this.seedData(seller.sellerArray, '10');
    }

    return {};
  }

  public async seedData(sellers: Seller[], count: string): Promise<boolean> {
    const categories: string[] = [
      'Graphics & Design',
      'Digital Marketing',
      'Writing & Translation',
      'Video & Animation',
      'Music & Audio',
      'Programming & Tech',
      'Data',
      'Business'
    ];
    const expectedDelivery: string[] = ['1 Day Delivery', '2 Days Delivery', '3 Days Delivery', '4 Days Delivery', '5 Days Delivery'];
    const randomRatings = [
      { sum: 20, count: 4 },
      { sum: 10, count: 2 },
      { sum: 20, count: 4 },
      { sum: 15, count: 3 },
      { sum: 5, count: 1 }
    ];

    for (let i = 0; i < sellers.length; i++) {
      const sellerDoc: Seller = sellers[i];
      const title = `I will ${faker.word.words(5)}`;
      const basicTitle = faker.commerce.productName();
      const basicDescription = faker.commerce.productDescription();
      const rating = sample(randomRatings);
      const gig: ISellerGig = {
        userId: sellerDoc.userId,
        sellerId: sellerDoc.id,
        title: title.length <= 80 ? title : title.slice(0, 80),
        basicTitle: basicTitle.length <= 40 ? basicTitle : basicTitle.slice(0, 40),
        basicDescription: basicDescription.length <= 100 ? basicDescription : basicDescription.slice(0, 100),
        categories: `${sample(categories)}`,
        subCategories: [faker.commerce.department(), faker.commerce.department(), faker.commerce.department()],
        description: faker.lorem.sentences({ min: 2, max: 4 }),
        tags: [faker.commerce.product(), faker.commerce.product(), faker.commerce.product(), faker.commerce.product()],
        price: parseInt(faker.commerce.price({ min: 20, max: 30, dec: 0 })),
        coverImage: faker.image.urlPicsumPhotos(),
        expectedDelivery: `${sample(expectedDelivery)}`,
        sortId: parseInt(count, 10) + i + 1,
        ratingsCount: (i + 1) % 4 === 0 ? rating!['count'] : 0,
        ratingSum: (i + 1) % 4 === 0 ? rating!['sum'] : 0
      };
      console.log(`***SEEDING GIG*** - ${i + 1} of ${count}`);

   await this.gigService.create({ gig: gig });
    }

    return true;
  }
}
