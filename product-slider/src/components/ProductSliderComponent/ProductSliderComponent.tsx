/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { HTMLAttributes } from 'preact/compat';
import { classes } from '@adobe-commerce/elsie/lib';
import type { ProductSliderItem } from '@/tfsproductslider/data/models';
import {
  ProductCard,
  type ProductClickTarget,
} from '@/tfsproductslider/components/ProductCard';
import '@/tfsproductslider/components/ProductSliderComponent/ProductSliderComponent.css';

export interface ProductSliderComponentProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  products?: ProductSliderItem[];
  loading?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string;
  previousLabel?: string;
  nextLabel?: string;
  fromLabel?: string;
  saveLabel?: string;
  reviewsLabel?: string;
  reviewLabel?: string;
  skeletonCount?: number;
  onProductClick?: (
    product: ProductSliderItem,
    target: ProductClickTarget
  ) => void;
  onProductImageClick?: (product: ProductSliderItem) => void;
  onProductNameClick?: (product: ProductSliderItem) => void;
}

export const ProductSliderComponent: FunctionComponent<ProductSliderComponentProps> = ({
  className,
  title,
  products = [],
  loading = false,
  errorMessage = null,
  emptyMessage = 'No products found.',
  previousLabel = 'Previous products',
  nextLabel = 'Next products',
  fromLabel,
  saveLabel,
  reviewsLabel,
  reviewLabel,
  skeletonCount = 4,
  onProductClick,
  onProductImageClick,
  onProductNameClick,
  ...props
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.9 * direction;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const showNav = !loading && !errorMessage && products.length > 1;

  return (
    <div
      {...props}
      className={classes(['tfsproductslider-product-slider-component', className])}
    >
      {(title || showNav) && (
        <div className="tfsproductslider-product-slider-component__header">
          {title ? (
            <h2 className="tfsproductslider-product-slider-component__title">{title}</h2>
          ) : (
            <span />
          )}

          {showNav && (
            <div className="tfsproductslider-product-slider-component__nav">
              <button
                type="button"
                className="tfsproductslider-product-slider-component__nav-btn"
                aria-label={previousLabel}
                onClick={() => scrollByPage(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                className="tfsproductslider-product-slider-component__nav-btn"
                aria-label={nextLabel}
                onClick={() => scrollByPage(1)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <p
          className="tfsproductslider-product-slider-component__status tfsproductslider-product-slider-component__status--error"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      {!errorMessage && !loading && products.length === 0 && (
        <p
          className="tfsproductslider-product-slider-component__status"
          role="status"
        >
          {emptyMessage}
        </p>
      )}

      {!errorMessage && (loading || products.length > 0) && (
        <div
          ref={trackRef}
          className="tfsproductslider-product-slider-component__track"
          role="list"
        >
          {loading
            ? Array.from({ length: skeletonCount }, (_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="tfsproductslider-product-slider-component__slide"
                  role="listitem"
                >
                  <div
                    className="tfsproductslider-product-slider-component__skeleton"
                    aria-hidden="true"
                  />
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product.sku}
                  className="tfsproductslider-product-slider-component__slide"
                  role="listitem"
                >
                  <ProductCard
                    product={product}
                    fromLabel={fromLabel}
                    saveLabel={saveLabel}
                    reviewsLabel={reviewsLabel}
                    reviewLabel={reviewLabel}
                    onProductClick={onProductClick}
                    onProductImageClick={onProductImageClick}
                    onProductNameClick={onProductNameClick}
                  />
                </div>
              ))}
        </div>
      )}
    </div>
  );
};
