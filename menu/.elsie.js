/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

module.exports = {
  name: 'TfsMenu',
  api: {
    root: './src/api',
    importAliasRoot: '@/tfsmenu/api',
  },
  components: [
    {
      id: 'Components',
      root: './src/components',
      importAliasRoot: '@/tfsmenu/components',
      cssPrefix: 'tfsmenu',
      default: true,
    },
  ],
  containers: {
    root: './src/containers',
    importAliasRoot: '@/tfsmenu/containers',
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
