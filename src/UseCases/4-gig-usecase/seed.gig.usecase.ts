import { faker } from '@faker-js/faker';


import { sample } from 'lodash';
import { createGIG } from '../../Database/Mongoose/Repositories/gig.repository';
import { findSeller } from '../../Database/Mongoose/Repositories/seller.respository';
import { Seller } from '../../Entities/Seller';
import { IRepoResponse } from '../../IBaseRepositories';
import { ISellerGig } from '../../Interface/IGig.interface';


export interface ISellerGigSeedDTO {}

export interface ISellerGigSeedResult {}

export class GigSeedUsecases  {
  public async execute(_input: ISellerGigSeedDTO): Promise<ISellerGigSeedResult> {
    const seller: IRepoResponse = await findSeller();

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

   await createGIG({ gig: gig });
    }

    return true;
  }
}
