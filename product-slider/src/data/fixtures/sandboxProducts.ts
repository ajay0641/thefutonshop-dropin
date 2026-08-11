/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import type { ProductSliderItem } from '@/tfsproductslider/data/models';
import { transformProductSearch } from '@/tfsproductslider/data/transforms';

/**
 * Sample Catalog Service response shapes for Storybook.
 * Live GraphQL uses getProductSlider (SimpleProductView + ComplexProductView).
 */
export const sandboxProductSearchResponse = {
  productSearch: {
    total_count: 3,
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
              url: 'https://na1-static-sandbox.api.commerce.adobe.com/4XR4RKXgJjQXaxUCMC6TN3/media/catalog/product/i/p/iphone-17-pro-max_1.jpeg',
              label: 'iphone',
              roles: ['image'],
            },
          ],
          attributes: [
            { name: 'review_count', label: 'Reviews', value: '5', roles: [] },
            { name: 'rating_summary', label: 'Rating', value: '100', roles: [] },
          ],
          price: {
            regular: { amount: { value: 1299, currency: 'USD' } },
            final: { amount: { value: 1199, currency: 'USD' } },
          },
        },
      },
      {
        productView: {
          sku: 'Iphone17promax-Sky-Blue',
          name: 'iPhone 17 Pro Max-Sky-Blue',
          url: '',
          urlKey: 'iphone-17-pro-max-sky-blue',
          inStock: true,
          addToCartAllowed: true,
          images: [
            {
              url: 'https://na1-static-sandbox.api.commerce.adobe.com/4XR4RKXgJjQXaxUCMC6TN3/media/catalog/product/i/p/iphone-15-pro.jpg',
              label: '',
              roles: ['image'],
            },
          ],
          attributes: [],
          price: {
            regular: { amount: { value: 1199, currency: 'USD' } },
            final: { amount: { value: 1099, currency: 'USD' } },
          },
        },
      },
      {
        productView: {
          sku: 'new-product-test',
          name: 'New Product Test',
          url: '',
          urlKey: 'new-product-test',
          inStock: true,
          addToCartAllowed: false,
          images: [
            {
              url: 'https://na1-static-sandbox.api.commerce.adobe.com/4XR4RKXgJjQXaxUCMC6TN3/media/catalog/product/n/e/new.jpg',
              label: '',
              roles: ['image'],
            },
          ],
          attributes: [],
          priceRange: {
            minimum: {
              regular: { amount: { value: 100, currency: 'USD' } },
              final: { amount: { value: 85, currency: 'USD' } },
            },
            maximum: {
              regular: { amount: { value: 150, currency: 'USD' } },
              final: { amount: { value: 120, currency: 'USD' } },
            },
          },
        },
      },
    ],
  },
};

/** Transformed slider items (same path as getProductSlider). */
export const sandboxProducts: ProductSliderItem[] = transformProductSearch(
  sandboxProductSearchResponse
).items;
