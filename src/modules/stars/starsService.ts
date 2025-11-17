import type { Star } from '../../types';
import { httpClient } from '../api/httpClient';
import { starsData } from '../../data/stars';

interface StarFromAPI {
  id: number;
  title: string;
  description: string;
  image_path: string;
  spectral_type: string;
  temperature: string;
  radius: string;
  mass: string;
  luminosity: string;
  metallicity: string;
  age: string;
  distance: string;
}

interface StarsResponse {
  stars: StarFromAPI[];
}

interface StarResponse {
  star: StarFromAPI;
}

const mapStarFromAPI = (star: StarFromAPI): Star => ({
  id: star.id,
  title: star.title,
  description: star.description,
  imagePath: star.image_path,
  spectralType: star.spectral_type,
  temperature: star.temperature,
  radius: star.radius,
  mass: star.mass,
  luminosity: star.luminosity,
  metallicity: star.metallicity,
  age: star.age,
  distance: star.distance,
});

export const starsService = {
  async getAll(): Promise<Star[]> {
    try {
      const response = await httpClient.get<StarsResponse>('/stars');
      return (response.stars || []).map(mapStarFromAPI);
    } catch (error) {
      console.warn('API недоступен, используем mock-данные:', error);
      return starsData;
    }
  },

  async getByTitle(title: string): Promise<Star[]> {
    try {
      const response = await httpClient.get<StarsResponse>(
        `/stars?searchedStar=${encodeURIComponent(title)}`
      );
      return (response.stars || []).map(mapStarFromAPI);
    } catch (error) {
      console.warn('API недоступен, используем mock-данные:', error);
      if (!title.trim()) {
        return starsData;
      }
      const query = title.toLowerCase().trim();
      return starsData.filter((star) =>
        star.title.toLowerCase().includes(query)
      );
    }
  },

  async getById(id: number): Promise<Star | undefined> {
    try {
      const response = await httpClient.get<StarResponse>(`/stars/${id}`);
      return response.star ? mapStarFromAPI(response.star) : undefined;
    } catch (error) {
      console.warn(`API недоступен, используем mock-данные для id ${id}:`, error);
      return starsData.find((star) => star.id === id);
    }
  },

  async getByIds(ids: number[]): Promise<Star[]> {
    try {
      const allStars = await this.getAll();
      return allStars.filter((star) => ids.includes(star.id));
    } catch (error) {
      console.warn('API недоступен, используем mock-данные:', error);
      return starsData.filter((star) => ids.includes(star.id));
    }
  },
};
