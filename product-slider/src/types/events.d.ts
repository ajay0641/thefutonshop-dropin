import '@adobe-commerce/event-bus';
import type { ProductSliderItem } from '@/tfsproductslider/data/models';

declare module '@adobe-commerce/event-bus' {
  interface Events {
    'product-slider/data': {
      totalCount: number;
      items: ProductSliderItem[];
    };
    'product-slider/error': {
      message: string;
    };
    'product-slider/product-click': {
      product: ProductSliderItem;
      target: 'image' | 'name';
    };
    'product-slider/add-to-cart': {
      product: ProductSliderItem;
    };
  }
}
