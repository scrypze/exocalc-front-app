import { starsService } from './starsService';
import type { Star } from '../../types';

export const starFilters = {
  /**
   * Фильтрация звёзд по названию через API
   */
  async byTitle(query: string): Promise<Star[]> {
    if (!query.trim()) {
      return starsService.getAll();
    }
    
    return starsService.getByTitle(query);
  },
};
