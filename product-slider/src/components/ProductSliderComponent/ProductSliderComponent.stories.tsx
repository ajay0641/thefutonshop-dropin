/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import type { Meta, StoryObj } from '@storybook/preact';
import { ProductSliderComponent } from '@/tfsproductslider/components/ProductSliderComponent';
import { sandboxProducts } from '@/tfsproductslider/data/fixtures/sandboxProducts';

const meta: Meta<typeof ProductSliderComponent> = {
  title: 'Components/ProductSliderComponent',
  component: ProductSliderComponent,
  parameters: {
    docs: {
      description: {
        component:
          'UI-only stories. Products are static fixtures from the sandbox Altair productSearch response. Live GraphQL runs in the HTML sandbox (`npm run serve`), not here.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProductSliderComponent>;

export const Default: Story = {
  args: {
    title: 'New Arrivals',
    products: sandboxProducts,
  },
};

export const Loading: Story = {
  args: {
    title: 'New Arrivals',
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    title: 'New Arrivals',
    products: [],
  },
};
