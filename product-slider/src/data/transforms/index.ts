/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import type {
  ProductSliderItem,
  ProductSliderResult,
} from '@/tfsproductslider/data/models';

type MoneyAmount = {
  amount?: { value?: number | null; currency?: string | null } | null;
};

type PricePair = {
  regular?: MoneyAmount | null;
  final?: MoneyAmount | null;
};

/** Raw productView shape from Catalog Service productSearch */
export interface RawProductView {
  sku?: string | null;
  name?: string | null;
  url?: string | null;
  urlKey?: string | null;
  inStock?: boolean | null;
  addToCartAllowed?: boolean | null;
  images?: Array<{
    url?: string | null;
    label?: string | null;
    roles?: string[] | null;
  }> | null;
  attributes?: Array<{
    name?: string | null;
    label?: string | null;
    value?: string | null;
    roles?: string[] | null;
  }> | null;
  /** SimpleProductView */
  price?: PricePair | null;
  /** ComplexProductView */
  priceRange?: {
    minimum?: PricePair | null;
    maximum?: PricePair | null;
  } | null;
}

export interface RawProductSearchItem {
  productView?: RawProductView | null;
}

export interface RawProductSearchResponse {
  productSearch?: {
    total_count?: number | null;
    items?: Array<RawProductSearchItem | null> | null;
  } | null;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

function getAttribute(
  attributes: RawProductView['attributes'],
  names: string[]
): string | undefined {
  if (!attributes?.length) return undefined;
  const lowered = names.map((n) => n.toLowerCase());
  const match = attributes.find(
    (attr) => attr?.name && lowered.includes(attr.name.toLowerCase())
  );
  return match?.value ?? undefined;
}

function toNumber(value: string | undefined): number | undefined {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function pickImage(
  images: RawProductView['images']
): { url?: string; label?: string } | undefined {
  if (!images?.length) return undefined;

  const preferredRoles = ['image', 'small_image', 'thumbnail'];
  for (const role of preferredRoles) {
    const match = images.find((img) =>
      img?.roles?.some((r) => r?.toLowerCase() === role)
    );
    if (match?.url) {
      return { url: match.url, label: match.label ?? undefined };
    }
  }

  const first = images.find((img) => img?.url);
  return first
    ? { url: first.url ?? undefined, label: first.label ?? undefined }
    : undefined;
}

function extractMoney(pair: PricePair | null | undefined): {
  finalPrice?: number;
  regularPrice?: number;
  currency?: string;
} {
  const finalPrice = pair?.final?.amount?.value ?? undefined;
  const regularPrice = pair?.regular?.amount?.value ?? undefined;
  const currency =
    pair?.final?.amount?.currency ??
    pair?.regular?.amount?.currency ??
    undefined;
  return { finalPrice, regularPrice, currency };
}

function computeSavePercent(
  finalPrice?: number,
  regularPrice?: number
): number | undefined {
  if (
    typeof finalPrice === 'number' &&
    typeof regularPrice === 'number' &&
    regularPrice > finalPrice &&
    regularPrice > 0
  ) {
    return Math.round(((regularPrice - finalPrice) / regularPrice) * 100);
  }
  return undefined;
}

function resolveUrl(view: RawProductView): string {
  if (view.url) return view.url;
  if (view.urlKey) return `/${view.urlKey}`;
  return '#';
}

function resolveSubtitle(view: RawProductView): string | undefined {
  const fromAttrs = getAttribute(view.attributes, [
    'short_description',
    'subtitle',
    'brand',
    'manufacturer',
  ]);
  if (fromAttrs) {
    return stripHtml(fromAttrs);
  }
  return undefined;
}

/**
 * Map a Catalog Service productView into a slider product item.
 * Supports SimpleProductView.price and ComplexProductView.priceRange.
 */
export function transformProductView(
  view: RawProductView | null | undefined
): ProductSliderItem | null {
  if (!view?.sku || !view?.name) {
    return null;
  }

  const image = pickImage(view.images);
  const isComplex = !!view.priceRange;
  const min = isComplex
    ? extractMoney(view.priceRange?.minimum)
    : extractMoney(view.price);
  const max = isComplex ? extractMoney(view.priceRange?.maximum) : {};

  const finalPrice = min.finalPrice;
  const regularPrice = min.regularPrice;
  const currency = min.currency ?? max.currency;
  const savePercent = computeSavePercent(finalPrice, regularPrice);

  const rating =
    toNumber(getAttribute(view.attributes, ['rating_summary', 'rating'])) ??
    undefined;
  const normalizedRating =
    rating != null ? (rating > 5 ? Math.min(5, rating / 20) : rating) : undefined;

  const reviewCount = toNumber(
    getAttribute(view.attributes, ['review_count', 'reviews_count'])
  );

  return {
    sku: view.sku,
    name: view.name,
    subtitle: resolveSubtitle(view),
    url: resolveUrl(view),
    urlKey: view.urlKey ?? undefined,
    imageUrl: image?.url,
    imageLabel: image?.label || view.name,
    finalPrice,
    regularPrice,
    currency,
    maxFinalPrice: max.finalPrice,
    maxRegularPrice: max.regularPrice,
    isPriceRange: isComplex,
    savePercent,
    inStock: view.inStock ?? undefined,
    addToCartAllowed: view.addToCartAllowed ?? undefined,
    rating: normalizedRating,
    reviewCount,
  };
}

/**
 * Transform productSearch GraphQL response into drop-in model.
 */
export function transformProductSearch(
  data: RawProductSearchResponse | null | undefined
): ProductSliderResult {
  const search = data?.productSearch;
  const items = (search?.items ?? [])
    .map((item) => transformProductView(item?.productView))
    .filter((item): item is ProductSliderItem => item != null);

  return {
    totalCount: search?.total_count ?? items.length,
    items,
  };
}
