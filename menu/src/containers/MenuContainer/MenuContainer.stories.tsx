/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

import type { Meta, StoryObj } from '@storybook/preact';
import { MenuContainer } from '@/tfsmenu/containers/MenuContainer';
import { fetchSandboxCategories } from '@/tfsmenu/data/fixtures/sandboxCategories';

const meta: Meta<typeof MenuContainer> = {
  title: 'Containers/MenuContainer',
  component: MenuContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Container stories use mocked category data by default. For live Magento GraphQL data, use `examples/html-host` (`npm run serve`) after `npm run build`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MenuContainer>;

export const Default: Story = {
  args: {
    parentId: '2',
    fetchCategories: fetchSandboxCategories,
  },
};
