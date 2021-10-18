import slugify from '@sindresorhus/slugify';

import { CategoryName } from '../types';

export function getCategoryContainerId(category: CategoryName) {
  return `emoji-picker__${slugify(category)}`;
}
