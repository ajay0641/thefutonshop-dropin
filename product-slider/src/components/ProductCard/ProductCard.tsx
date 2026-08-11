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
import '@/tfsproductslider/components/ProductCard/ProductCard.css';

export type ProductClickTarget = 'image' | 'name';

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: ProductSliderItem;
  fromLabel?: string;
  saveLabel?: string;
  reviewsLabel?: string;
  reviewLabel?: string;
  /** Fires for image or name click (with which target was used). */
  onProductClick?: (
    product: ProductSliderItem,
    target: ProductClickTarget
  ) => void;
  /** Image-only click (also receives `onProductClick` with target "image"). */
  onProductImageClick?: (product: ProductSliderItem) => void;
  /** Name-only click (also receives `onProductClick` with target "name"). */
  onProductNameClick?: (product: ProductSliderItem) => void;
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
  onProductClick,
  onProductImageClick,
  onProductNameClick,
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
  } = product;

  const showPricing = typeof finalPrice === 'number';
  const showRegular =
    typeof regularPrice === 'number' &&
    typeof finalPrice === 'number' &&
    regularPrice > finalPrice;
  const showSave = typeof savePercent === 'number' && savePercent > 0;
  const showReviews = typeof reviewCount === 'number' && reviewCount > 0;
  const showRating = typeof rating === 'number' && rating > 0;

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

  return (
    <div
      {...props}
      className={classes(['tfsproductslider-product-card', className])}
    >
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
