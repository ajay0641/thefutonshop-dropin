/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/
  
import { HTMLAttributes } from 'preact/compat';
import { Container } from '@adobe-commerce/elsie/lib';
import { MenuComponent } from '@/tfsmenu/components/MenuComponent';
import type { CategoryItem } from '@/tfsmenu/api/menu';

export interface MenuContainerProps extends HTMLAttributes<HTMLDivElement> {
  parentId?: string;
  fetchCategories?: () => Promise<CategoryItem[]>;
}
    
export const MenuContainer: Container<MenuContainerProps> = ({
  parentId,
  fetchCategories,
  ...props
}) => {
  return (
    <div {...props}>
      <MenuComponent parentId={parentId} fetchCategories={fetchCategories} />
    </div>
  );
};
