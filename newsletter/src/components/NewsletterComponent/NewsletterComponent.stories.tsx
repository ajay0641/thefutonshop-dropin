/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

// https://storybook.js.org/docs/7.0/preact/writing-stories/introduction
import type { Meta, StoryObj } from '@storybook/preact';
import {
  NewsletterComponent as component,
  NewsletterComponentProps,
} from '@/tfsnewsletterdropin/components/NewsletterComponent';

/**
 * Email field + Subscribe button.
 */
const meta: Meta<NewsletterComponentProps> = {
  title: 'Components/NewsletterComponent',
  component,
  argTypes: {
    email: {
      description: 'Current email input value.',
      control: 'text',
    },
    loading: {
      description: 'Whether the form is submitting.',
      control: 'boolean',
    },
    onEmailChange: { action: 'onEmailChange' },
    onSubmit: { action: 'onSubmit' },
  },
};

export default meta;

type Story = StoryObj<NewsletterComponentProps>;

export const Default: Story = {
  args: {
    email: '',
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    email: 'test1@test1.com',
    loading: true,
  },
};
