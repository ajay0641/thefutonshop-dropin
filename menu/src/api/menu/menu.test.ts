/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

import { getMenu } from '@/tfsmenu/api/menu';
import { fetchGraphQl } from '@/tfsmenu/api/fetch-graphql';

jest.mock('@/tfsmenu/api/fetch-graphql', () => ({
  fetchGraphQl: jest.fn(),
  setFetchGraphQlHeader: jest.fn(),
}));

describe('TfsMenu/api/menu', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns categories on success', async () => {
    const mockCategories = [
      {
        id: '2',
        name: 'Default Category',
        level: 1,
        urlPath: 'default-category',
        urlKey: 'default-category',
        parentId: '1',
        children: ['3'],
      },
      {
        id: '3',
        name: 'Category 1',
        level: 2,
        urlPath: 'category-1',
        urlKey: 'category-1',
        parentId: '2',
        children: [],
      },
    ];

    (fetchGraphQl as jest.Mock).mockResolvedValue({
      data: {
        categories: mockCategories,
      },
    });

    const result = await getMenu();
    expect(result).toEqual(mockCategories);
    expect(fetchGraphQl).toHaveBeenCalledTimes(1);
  });

  test('throws error when errors are present', async () => {
    (fetchGraphQl as jest.Mock).mockResolvedValue({
      errors: [{ message: 'GraphQL error' }],
    });

    await expect(getMenu('2')).rejects.toThrow('GraphQL error');
    expect(fetchGraphQl).toHaveBeenCalledTimes(1);
  });
});
