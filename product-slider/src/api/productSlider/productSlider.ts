/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { fetchGraphQl } from '@/tfsproductslider/api/fetch-graphql';
import type {
  GetProductSliderOptions,
  ProductSearchFilter,
  ProductSliderResult,
} from '@/tfsproductslider/data/models';
import {
  transformProductSearch,
  type RawProductSearchResponse,
} from '@/tfsproductslider/data/transforms';

const DEFAULT_FILTER: ProductSearchFilter[] = [
  {
    attribute: 'isNew',
    eq: '1',
  },
];

/**
 * Catalog Service productSearch — SimpleProductView.price +
 * ComplexProductView.priceRange (minimum/maximum).
 */
const PRODUCT_SLIDER_QUERY = `
  query ProductSlider(
    $phrase: String!
    $pageSize: Int!
    $currentPage: Int!
    $filter: [SearchClauseInput!]
  ) {
    productSearch(
      phrase: $phrase
      page_size: $pageSize
      current_page: $currentPage
      filter: $filter
    ) {
      total_count
      items {
        productView {
          sku
          name
          url
          urlKey
          inStock
          addToCartAllowed
          images {
            url
            label
            roles
          }
          attributes {
            name
            label
            value
            roles
          }
          ... on SimpleProductView {
            price {
              regular {
                amount {
                  value
                  currency
                }
              }
              final {
                amount {
                  value
                  currency
                }
              }
            }
          }
          ... on ComplexProductView {
            priceRange {
              minimum {
                regular {
                  amount {
                    value
                    currency
                  }
                }
                final {
                  amount {
                    value
                    currency
                  }
                }
              }
              maximum {
                regular {
                  amount {
                    value
                    currency
                  }
                }
                final {
                  amount {
                    value
                    currency
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch products for the slider via Catalog Service productSearch.
 * Defaults: phrase "", pageSize 8, currentPage 1, filter isNew=1.
 */
export const getProductSlider = async (
  options: GetProductSliderOptions = {}
): Promise<ProductSliderResult> => {
  const {
    phrase = '',
    pageSize = 8,
    currentPage = 1,
    filter = DEFAULT_FILTER,
  } = options;

  const { data, errors } = await fetchGraphQl<RawProductSearchResponse>(
    PRODUCT_SLIDER_QUERY,
    {
      variables: {
        phrase,
        pageSize,
        currentPage,
        filter,
      },
    }
  );

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(', '));
  }

  return transformProductSearch(data);
};

/** @deprecated Use getProductSlider — kept for earlier scaffold import paths */
export const productSlider = getProductSlider;
