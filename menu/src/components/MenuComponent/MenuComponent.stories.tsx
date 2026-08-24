/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

import type { Meta, StoryObj } from '@storybook/preact';
import { MenuComponent } from '@/tfsmenu/components/MenuComponent';
import { fetchSandboxCategories } from '@/tfsmenu/data/fixtures/sandboxCategories';

const meta: Meta<typeof MenuComponent> = {
  title: 'Components/MenuComponent',
  component: MenuComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MenuComponent>;

export const Default: Story = {
  args: {
    parentId: '2',
    fetchCategories: fetchSandboxCategories,
  },
};
