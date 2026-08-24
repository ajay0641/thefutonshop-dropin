/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { FunctionComponent } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import { classes } from '@adobe-commerce/elsie/lib';
import type { ProductSliderItem } from '@/tfsproductslider/data/models';
import { CartIcon } from '@/tfsproductslider/components/ProductCard/CartIcon';
import { WishlistIcon } from '@/tfsproductslider/components/ProductCard/WishlistIcon';
import '@/tfsproductslider/components/ProductCard/ProductCard.css';

export type ProductClickTarget = 'image' | 'name';

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: ProductSliderItem;
  fromLabel?: string;
  saveLabel?: string;
  reviewsLabel?: string;
  reviewLabel?: string;
  addToCartLabel?: string;
  addToWishlistLabel?: string;
  /** Fires for image or name click (with which target was used). */
  onProductClick?: (
    product: ProductSliderItem,
    target: ProductClickTarget
  ) => void;
  /** Image-only click (also receives `onProductClick` with target "image"). */
  onProductImageClick?: (product: ProductSliderItem) => void;
  /** Name-only click (also receives `onProductClick` with target "name"). */
  onProductNameClick?: (product: ProductSliderItem) => void;
  /**
   * Add-to-cart UI hook only — drop-in does not call cart GraphQL.
   * Storefront should call `addProductsToCart` from `@dropins/storefront-cart`.
   */
  onAddToCart?: (product: ProductSliderItem) => void;
  /**
   * Add-to-wishlist UI hook only — drop-in does not call wishlist GraphQL.
   * Storefront should wire `@dropins/storefront-wishlist` (or equivalent).
   */
  onAddToWishlist?: (product: ProductSliderItem) => void;
}

function formatMoney(value: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <span className="tfsproductslider-product-card__stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={classes([
            'tfsproductslider-product-card__star',
            index < filled && 'tfsproductslider-product-card__star--filled',
          ])}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export const ProductCard: FunctionComponent<ProductCardProps> = ({
  product,
  fromLabel = 'From:',
  saveLabel = 'Save up to {percent}%',
  reviewsLabel = '{count} Reviews',
  reviewLabel = '{count} Review',
  addToCartLabel = 'Add to cart',
  addToWishlistLabel = 'Add to wish list',
  onProductClick,
  onProductImageClick,
  onProductNameClick,
  onAddToCart,
  onAddToWishlist,
  className,
  ...props
}) => {
  const {
    name,
    subtitle,
    url,
    imageUrl,
    imageLabel,
    finalPrice,
    regularPrice,
    currency = 'USD',
    savePercent,
    rating,
    reviewCount,
    addToCartAllowed,
  } = product;

  const showPricing = typeof finalPrice === 'number';
  const showRegular =
    typeof regularPrice === 'number' &&
    typeof finalPrice === 'number' &&
    regularPrice > finalPrice;
  const showSave = typeof savePercent === 'number' && savePercent > 0;
  const showReviews = typeof reviewCount === 'number' && reviewCount > 0;
  const showRating = typeof rating === 'number' && rating > 0;
  const showAddToCart = typeof onAddToCart === 'function';
  const showAddToWishlist = typeof onAddToWishlist === 'function';
  const atcDisabled = addToCartAllowed === false;

  const reviewsText =
    reviewCount === 1
      ? reviewLabel.replace('{count}', String(reviewCount))
      : reviewsLabel.replace('{count}', String(reviewCount ?? 0));

  const handleImageClick = () => {
    onProductImageClick?.(product);
    onProductClick?.(product, 'image');
  };

  const handleNameClick = () => {
    onProductNameClick?.(product);
    onProductClick?.(product, 'name');
  };

  const handleAddToCart = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (atcDisabled) return;
    onAddToCart?.(product);
  };

  const handleAddToWishlist = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToWishlist?.(product);
  };

  return (
    <div
      {...props}
      className={classes(['tfsproductslider-product-card', className])}
    >
      <div className="tfsproductslider-product-card__media-wrap">
        <a
          className="tfsproductslider-product-card__media-link"
          href={url}
          onClick={handleImageClick}
          aria-label={name}
        >
          <div className="tfsproductslider-product-card__media">
            {imageUrl ? (
              <img
                className="tfsproductslider-product-card__image"
                src={imageUrl}
                alt={imageLabel || name}
                loading="lazy"
                width={480}
                height={480}
              />
            ) : (
              <div
                className="tfsproductslider-product-card__image tfsproductslider-product-card__image--placeholder"
                aria-hidden="true"
              />
            )}
          </div>
        </a>

        {(showAddToCart || showAddToWishlist) && (
          <div className="tfsproductslider-product-card__actions">
            {showAddToCart && (
              <button
                type="button"
                className="tfsproductslider-product-card__action-btn tfsproductslider-product-card__atc"
                aria-label={addToCartLabel}
                disabled={atcDisabled}
                onClick={handleAddToCart}
              >
                <CartIcon className="tfsproductslider-product-card__action-btn-icon" />
              </button>
            )}

            {showAddToWishlist && (
              <button
                type="button"
                className="tfsproductslider-product-card__action-btn tfsproductslider-product-card__wishlist"
                aria-label={addToWishlistLabel}
                onClick={handleAddToWishlist}
              >
                <WishlistIcon className="tfsproductslider-product-card__action-btn-icon" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="tfsproductslider-product-card__body">
        <h3 className="tfsproductslider-product-card__title">
          <a
            className="tfsproductslider-product-card__title-link"
            href={url}
            onClick={handleNameClick}
          >
            {name}
          </a>
        </h3>
        {subtitle && (
          <p className="tfsproductslider-product-card__subtitle">{subtitle}</p>
        )}

        {(showRating || showReviews) && (
          <div className="tfsproductslider-product-card__reviews">
            {showRating && <StarRating rating={rating!} />}
            {showReviews && (
              <span className="tfsproductslider-product-card__review-count">
                {reviewsText}
              </span>
            )}
          </div>
        )}

        {showPricing && (
          <div className="tfsproductslider-product-card__pricing">
            <div className="tfsproductslider-product-card__price-row">
              <span className="tfsproductslider-product-card__from">{fromLabel}</span>
              {showRegular && (
                <span className="tfsproductslider-product-card__regular">
                  {formatMoney(regularPrice!, currency)}
                </span>
              )}
              <span className="tfsproductslider-product-card__final">
                {formatMoney(finalPrice!, currency)}
              </span>
            </div>
            {showSave && (
              <p className="tfsproductslider-product-card__save">
                {saveLabel.replace('{percent}', String(savePercent))}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
