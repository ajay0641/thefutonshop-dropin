/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import type { Meta, StoryObj } from '@storybook/preact';
import { ProductSliderContainer } from '@/tfsproductslider/containers/ProductSliderContainer';
import {
  sandboxProducts,
  sandboxProductSearchResponse,
} from '@/tfsproductslider/data/fixtures/sandboxProducts';
import { transformProductSearch } from '@/tfsproductslider/data/transforms';

const meta: Meta<typeof ProductSliderContainer> = {
  title: 'Containers/ProductSliderContainer',
  component: ProductSliderContainer,
  parameters: {
    docs: {
      description: {
        component:
          'Container stories use mocked fetch by default. For live Catalog Service data, use `examples/html-host` (`npm run serve`) after `npm run build`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProductSliderContainer>;

/** Mirrors Altair productSearch payload (no live network call). */
export const FromAltairSandboxResponse: Story = {
  args: {
    title: 'New Arrivals',
    fetchProducts: async () =>
      transformProductSearch(sandboxProductSearchResponse),
    onAddToCart: (product) => {
      // eslint-disable-next-line no-console
      console.log('onAddToCart', product.sku);
    },
    onAddToWishlist: (product) => {
      // eslint-disable-next-line no-console
      console.log('onAddToWishlist', product.sku);
    },
  },
};

export const StaticItems: Story = {
  args: {
    title: 'New Arrivals',
    fetchProducts: async () => ({
      totalCount: sandboxProducts.length,
      items: sandboxProducts,
    }),
    onAddToCart: (product) => {
      // eslint-disable-next-line no-console
      console.log('onAddToCart', product.sku);
    },
    onAddToWishlist: (product) => {
      // eslint-disable-next-line no-console
      console.log('onAddToWishlist', product.sku);
    },
  },
};
