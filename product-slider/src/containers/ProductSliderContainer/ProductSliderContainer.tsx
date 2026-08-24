/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { useEffect, useState } from 'preact/hooks';
import { HTMLAttributes } from 'preact/compat';
import { Container } from '@adobe-commerce/elsie/lib';
import { useText } from '@adobe-commerce/elsie/i18n';
import { events } from '@adobe-commerce/event-bus';
import { ProductSliderComponent } from '@/tfsproductslider/components';
import { getProductSlider } from '@/tfsproductslider/api/productSlider';
import type {
  GetProductSliderOptions,
  ProductSearchFilter,
  ProductSliderItem,
  ProductSliderResult,
} from '@/tfsproductslider/data/models';

export interface ProductSliderContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    GetProductSliderOptions {
  /** Optional heading above the slider */
  title?: string;
  /**
   * Optional custom fetch. When provided, replaces the default productSearch call.
   * Use this to power the same slider UI from a different API / query.
   */
  fetchProducts?: () => Promise<ProductSliderResult>;
  onLoad?: (result: ProductSliderResult) => void;
  onError?: (payload: { message: string }) => void;
  /** Shared handler for image or name clicks (`target` is which one). */
  onProductClick?: (
    product: ProductSliderItem,
    target: 'image' | 'name'
  ) => void;
  onProductImageClick?: (product: ProductSliderItem) => void;
  onProductNameClick?: (product: ProductSliderItem) => void;
  /**
   * Add-to-cart UI hook only (no cart GraphQL in this drop-in).
   * Storefront should call:
   *   addProductsToCart([{ sku: product.sku, quantity: 1 }])
   * from `@dropins/storefront-cart`.
   */
  onAddToCart?: (product: ProductSliderItem) => void;
  /**
   * Add-to-wishlist UI hook only (no wishlist GraphQL in this drop-in).
   * Storefront should wire `@dropins/storefront-wishlist` (or equivalent).
   */
  onAddToWishlist?: (product: ProductSliderItem) => void;
}

export const ProductSliderContainer: Container<ProductSliderContainerProps> = ({
  title,
  phrase = '',
  pageSize = 8,
  currentPage = 1,
  filter,
  fetchProducts,
  onLoad,
  onError,
  onProductClick,
  onProductImageClick,
  onProductNameClick,
  onAddToCart,
  onAddToWishlist,
  ...props
}) => {
  const labels = useText({
    loadingLabel: 'ProductSlider.ProductSliderContainer.loadingLabel',
    emptyMessage: 'ProductSlider.ProductSliderContainer.emptyMessage',
    errorMessage: 'ProductSlider.ProductSliderContainer.errorMessage',
    previousLabel: 'ProductSlider.ProductSliderContainer.previousLabel',
    nextLabel: 'ProductSlider.ProductSliderContainer.nextLabel',
    fromLabel: 'ProductSlider.ProductSliderContainer.fromLabel',
    saveLabel: 'ProductSlider.ProductSliderContainer.saveLabel',
    reviewsLabel: 'ProductSlider.ProductSliderContainer.reviewsLabel',
    reviewLabel: 'ProductSlider.ProductSliderContainer.reviewLabel',
    addToCartLabel: 'ProductSlider.ProductSliderContainer.addToCartLabel',
    addToWishlistLabel: 'ProductSlider.ProductSliderContainer.addToWishlistLabel',
  });

  const [products, setProducts] = useState<ProductSliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Serialize filter so inline arrays don't re-trigger fetch every render
  const filterKey = JSON.stringify(filter ?? null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const result = fetchProducts
          ? await fetchProducts()
          : await getProductSlider({
              phrase,
              pageSize,
              currentPage,
              filter: filter as ProductSearchFilter[] | undefined,
            });

        if (cancelled) return;

        setProducts(result.items);
        const payload = {
          totalCount: result.totalCount,
          items: result.items,
        };
        events.emit('product-slider/data', payload);
        onLoad?.(result);
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error
            ? error.message
            : labels.errorMessage || 'Unable to load products.';

        setProducts([]);
        setErrorMessage(message);
        const payload = { message };
        events.emit('product-slider/error', payload);
        onError?.(payload);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filterKey stands in for filter
  }, [phrase, pageSize, currentPage, filterKey, fetchProducts]);

  const handleProductClick = (
    product: ProductSliderItem,
    target: 'image' | 'name'
  ) => {
    events.emit('product-slider/product-click', { product, target });
    onProductClick?.(product, target);
  };

  const handleProductImageClick = (product: ProductSliderItem) => {
    onProductImageClick?.(product);
  };

  const handleProductNameClick = (product: ProductSliderItem) => {
    onProductNameClick?.(product);
  };

  const handleAddToCart = (product: ProductSliderItem) => {
    events.emit('product-slider/add-to-cart', { product });
    onAddToCart?.(product);
  };

  const handleAddToWishlist = (product: ProductSliderItem) => {
    events.emit('product-slider/add-to-wishlist', { product });
    onAddToWishlist?.(product);
  };

  return (
    <div {...props}>
      <ProductSliderComponent
        title={title}
        products={products}
        loading={loading}
        errorMessage={errorMessage}
        emptyMessage={labels.emptyMessage || 'No products found.'}
        previousLabel={labels.previousLabel || 'Previous products'}
        nextLabel={labels.nextLabel || 'Next products'}
        fromLabel={labels.fromLabel || 'From:'}
        saveLabel={labels.saveLabel || 'Save up to {percent}%'}
        reviewsLabel={labels.reviewsLabel || '{count} Reviews'}
        reviewLabel={labels.reviewLabel || '{count} Review'}
        addToCartLabel={labels.addToCartLabel || 'Add to cart'}
        addToWishlistLabel={labels.addToWishlistLabel || 'Add to wish list'}
        onProductClick={handleProductClick}
        onProductImageClick={handleProductImageClick}
        onProductNameClick={handleProductNameClick}
        onAddToCart={onAddToCart ? handleAddToCart : undefined}
        onAddToWishlist={onAddToWishlist ? handleAddToWishlist : undefined}
        aria-busy={loading}
        aria-label={title || labels.loadingLabel || 'Product slider'}
      />
    </div>
  );
};
