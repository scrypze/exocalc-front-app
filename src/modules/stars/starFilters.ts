import { starsService } from './starsService';
import type { Star } from '../../types';

export const starFilters = {
  async byTitle(query: string): Promise<Star[]> {
    if (!query.trim()) {
      return starsService.getAll();
    }
    
    return starsService.getByTitle(query);
  },
};
