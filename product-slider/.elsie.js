/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

module.exports = {
  name: 'TfsProductSlider',
  api: {
    root: './src/api',
    importAliasRoot: '@/tfsproductslider/api',
  },
  components: [
    {
      id: 'Components',
      root: './src/components',
      importAliasRoot: '@/tfsproductslider/components',
      cssPrefix: 'tfsproductslider',
      default: true,
    },
  ],
  containers: {
    root: './src/containers',
    importAliasRoot: '@/tfsproductslider/containers',
  },
  schema: {
    endpoint: process.env.ENDPOINT,
    headers: {
      'Magento-Store-View-Code': 'default',
      'Magento-Website-Code': 'base',
      'Magento-Store-Code': 'main_website_store',
    },
  },
};
