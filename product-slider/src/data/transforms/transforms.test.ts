/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import {
  transformProductSearch,
  transformProductView,
} from '@/tfsproductslider/data/transforms';

describe('TfsProductSlider/data/transforms', () => {
  test('maps SimpleProductView price and save percent', () => {
    const item = transformProductView({
      sku: 'X',
      name: 'Product',
      url: '/x',
      price: {
        final: { amount: { value: 85, currency: 'USD' } },
        regular: { amount: { value: 100, currency: 'USD' } },
      },
    });

    expect(item).toMatchObject({
      sku: 'X',
      savePercent: 15,
      finalPrice: 85,
      regularPrice: 100,
      isPriceRange: false,
    });
  });

  test('maps ComplexProductView priceRange minimum as From price', () => {
    const item = transformProductView({
      sku: 'CFG-1',
      name: 'Configurable',
      urlKey: 'configurable-product',
      inStock: true,
      addToCartAllowed: true,
      priceRange: {
        minimum: {
          final: { amount: { value: 934.12, currency: 'USD' } },
          regular: { amount: { value: 1098.96, currency: 'USD' } },
        },
        maximum: {
          final: { amount: { value: 1200, currency: 'USD' } },
          regular: { amount: { value: 1400, currency: 'USD' } },
        },
      },
      images: [
        {
          url: 'https://example.com/img.jpg',
          label: 'Main',
          roles: ['image'],
        },
      ],
    });

    expect(item).toMatchObject({
      sku: 'CFG-1',
      url: '/configurable-product',
      finalPrice: 934.12,
      regularPrice: 1098.96,
      maxFinalPrice: 1200,
      maxRegularPrice: 1400,
      isPriceRange: true,
      savePercent: 15,
      inStock: true,
      addToCartAllowed: true,
      imageUrl: 'https://example.com/img.jpg',
    });
  });

  test('transformProductSearch skips invalid items', () => {
    const result = transformProductSearch({
      productSearch: {
        total_count: 2,
        items: [
          { productView: { sku: 'A', name: 'A', url: '/a' } },
          { productView: { sku: null, name: 'Bad' } },
          null,
        ],
      },
    });

    expect(result.totalCount).toBe(2);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].sku).toBe('A');
  });
});
