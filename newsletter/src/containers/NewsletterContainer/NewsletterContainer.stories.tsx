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
  NewsletterContainer as component,
  NewsletterContainerProps,
} from '@/tfsnewsletterdropin/containers/NewsletterContainer';

const meta: Meta<NewsletterContainerProps> = {
  title: 'Containers/NewsletterContainer',
  component,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<NewsletterContainerProps>;

/**
 * ```ts
 * import { NewsletterContainer } from '@/tfsnewsletterdropin/containers/NewsletterContainer';
 * import { render as provider } from '@/tfsnewsletterdropin/render';
 * import { initialize, setEndpoint } from '@/tfsnewsletterdropin/api';
 *
 * setEndpoint('https://your-endpoint/graphql');
 * await initialize({ storeViewCode: 'default', websiteCode: 'base' });
 * provider.render(NewsletterContainer, {})(el);
 * ```
 */
export const NewsletterContainer: Story = {
  args: {},
};
