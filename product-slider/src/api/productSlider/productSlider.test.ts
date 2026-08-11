/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { fetchGraphQl } from '@/tfsproductslider/api/fetch-graphql';
import { getProductSlider } from '@/tfsproductslider/api/productSlider';

jest.mock('@/tfsproductslider/api/fetch-graphql', () => ({
  fetchGraphQl: jest.fn(),
}));

const mockFetchGraphQl = fetchGraphQl as jest.MockedFunction<typeof fetchGraphQl>;

describe('TfsProductSlider/api/getProductSlider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('uses expanded productSearch query and transforms results', async () => {
    mockFetchGraphQl.mockResolvedValue({
      data: {
        productSearch: {
          total_count: 1,
          items: [
            {
              productView: {
                sku: 'Iphone17promax',
                name: 'iPhone 17 Pro Max',
                url: '',
                urlKey: 'iphone-17-pro-max',
                inStock: true,
                addToCartAllowed: true,
                images: [
                  {
                    url: 'https://example.com/iphone.jpeg',
                    label: 'iphone',
                    roles: ['image'],
                  },
                ],
                attributes: [
                  { name: 'rating_summary', label: 'Rating', value: '100', roles: [] },
                  { name: 'review_count', label: 'Reviews', value: '5', roles: [] },
                ],
                price: {
                  final: { amount: { value: 1199, currency: 'USD' } },
                  regular: { amount: { value: 1299, currency: 'USD' } },
                },
              },
            },
          ],
        },
      },
    });

    const result = await getProductSlider();

    expect(mockFetchGraphQl).toHaveBeenCalledWith(
      expect.stringContaining('... on SimpleProductView'),
      expect.objectContaining({
        variables: {
          phrase: '',
          pageSize: 8,
          currentPage: 1,
          filter: [{ attribute: 'isNew', eq: '1' }],
        },
      })
    );
    expect(mockFetchGraphQl).toHaveBeenCalledWith(
      expect.stringContaining('... on ComplexProductView'),
      expect.any(Object)
    );

    expect(result.totalCount).toBe(1);
    expect(result.items[0]).toMatchObject({
      sku: 'Iphone17promax',
      name: 'iPhone 17 Pro Max',
      url: '/iphone-17-pro-max',
      finalPrice: 1199,
      regularPrice: 1299,
      savePercent: 8,
      reviewCount: 5,
      inStock: true,
    });
  });

  test('throws GraphQL errors', async () => {
    mockFetchGraphQl.mockResolvedValue({
      data: null as any,
      errors: [{ message: 'Forbidden', extensions: { category: 'graphql' } }],
    });

    await expect(getProductSlider()).rejects.toThrow('Forbidden');
  });
});
