/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

import { FunctionComponent } from 'preact';
import { HTMLAttributes, useEffect, useState } from 'preact/compat';
import { classes } from '@adobe-commerce/elsie/lib';
import { getMenu, CategoryItem } from '@/tfsmenu/api/menu';
import '@/tfsmenu/components/MenuComponent/MenuComponent.css';

export interface MenuComponentProps extends HTMLAttributes<HTMLDivElement> {
  parentId?: string;
  /** Optional custom fetch for Storybook, tests, or alternate data sources. */
  fetchCategories?: () => Promise<CategoryItem[]>;
}

export interface CategoryTreeItem extends CategoryItem {
  childCategories?: CategoryTreeItem[];
}

export const buildCategoryTree = (
  items: CategoryItem[],
  rootId: string
): CategoryTreeItem[] => {
  const itemMap = new Map<string, CategoryTreeItem>();

  // Map all items
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, childCategories: [] });
  });

  const roots: CategoryTreeItem[] = [];

  items.forEach((item) => {
    const mapped = itemMap.get(item.id)!;
    if (item.parentId === rootId) {
      roots.push(mapped);
    } else {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.childCategories!.push(mapped);
      }
    }
  });

  return roots;
};

export const MenuComponent: FunctionComponent<MenuComponentProps> = ({
  className,
  parentId = '2',
  fetchCategories,
  ...props
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const load = fetchCategories ?? (() => getMenu(parentId));

    load()
      .then((items) => {
        if (active) {
          setCategories(items);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load menu');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [parentId, fetchCategories]);

  if (loading) {
    return (
      <div className={classes(['tfsmenu-menu-component-loading', className])}>
        <div className="spinner" />
        <span>Loading Menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes(['tfsmenu-menu-component-error', className])}>
        <span>{error}</span>
      </div>
    );
  }

  const menuTree = buildCategoryTree(categories, parentId);

  if (menuTree.length === 0) {
    return null;
  }

  return (
    <nav
      {...props}
      className={classes(['tfsmenu-menu-component', className])}
    >
      <ul className="menu-list">
        {menuTree.map((item) => {
          const subItems = item.childCategories;
          const hasDropdown = subItems.length > 0;

          return (
            <li
              key={item.id}
              className={classes(['menu-item', hasDropdown ? 'has-dropdown' : ''])}
            >
              <a href={item.urlPath ? `/${item.urlPath}` : '#'} className="menu-link">
                {item.name}
              </a>
              {hasDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-menu-inner">
                    <div className="dropdown-grid">
                    {subItems.map((child) => {
                      const nestedItems = child.childCategories;
                      const hasNested = nestedItems.length > 0;

                      return (
                        <div key={child.id} className="dropdown-column">
                          <a
                            href={child.urlPath ? `/${child.urlPath}` : '#'}
                            className="dropdown-category-title"
                          >
                            {child.name}
                          </a>
                          {hasNested && (
                            <ul className="nested-list">
                              {nestedItems.map((nested) => (
                                <li key={nested.id} className="nested-item">
                                  <a
                                    href={nested.urlPath ? `/${nested.urlPath}` : '#'}
                                    className="nested-link"
                                  >
                                    {nested.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
