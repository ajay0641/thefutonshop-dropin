/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

import { fetchGraphQl, setFetchGraphQlHeader } from '@/tfsmenu/api/fetch-graphql';

export const GET_CATEGORIES_QUERY = `
  query GetCategories(
    $ids: [String!]!
    $roles: [String!]!
    $depth: Int!
    $startLevel: Int!
  ) {
    categories(
      ids: $ids
      roles: $roles
      subtree: {
        depth: $depth
        startLevel: $startLevel
      }
    ) {
      id
      name
      level
      urlPath
      urlKey
      parentId
      children
    }
  }
`;

export interface CategoryItem {
  id: string;
  name: string;
  level: number;
  urlPath: string;
  urlKey: string;
  parentId: string;
  children?: string[] | null;
}

export interface GetCategoriesResponse {
  categories: CategoryItem[];
}

export const getMenu = async (parentId: string = '2'): Promise<CategoryItem[]> => {
  // Set required Magento store and website headers
  setFetchGraphQlHeader('Magento-Store-View-Code', 'default');
  setFetchGraphQlHeader('Magento-Website-Code', 'base');

  const { data, errors } = await fetchGraphQl<GetCategoriesResponse>(
    GET_CATEGORIES_QUERY,
    {
      variables: {
        ids: [parentId],
        roles: ['show_in_menu', 'active'],
        depth: 3,
        startLevel: 1,
      },
    }
  );

  if (errors) {
    throw new Error(errors[0].message);
  }

  return data.categories;
};

export const menu = getMenu;
