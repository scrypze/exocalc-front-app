import type { Star } from '../../types';
import { httpClient } from '../api/httpClient';
import { starsData } from '../../data/stars';

// Интерфейс для данных от API (snake_case)
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

// Функция для преобразования данных из API в формат фронтенда
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
  /**
   * Получить все звёзды
   * При ошибке API возвращает mock-данные
   */
  async getAll(): Promise<Star[]> {
    try {
      const response = await httpClient.get<StarsResponse>('/stars');
      return (response.stars || []).map(mapStarFromAPI);
    } catch (error) {
      console.warn('API недоступен, используем mock-данные:', error);
      return starsData;
    }
  },

  /**
   * Получить звёзды с фильтрацией по названию
   * При ошибке API возвращает отфильтрованные mock-данные
   */
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

  /**
   * Получить звезду по ID
   * При ошибке API возвращает звезду из mock-данных
   */
  async getById(id: number): Promise<Star | undefined> {
    try {
      const response = await httpClient.get<StarResponse>(`/stars/${id}`);
      return response.star ? mapStarFromAPI(response.star) : undefined;
    } catch (error) {
      console.warn(`API недоступен, используем mock-данные для id ${id}:`, error);
      return starsData.find((star) => star.id === id);
    }
  },

  /**
   * Получить звёзды по списку ID
   * При ошибке API возвращает звёзды из mock-данных
   */
  async getByIds(ids: number[]): Promise<Star[]> {
    try {
      // Получаем все звёзды и фильтруем по ID на клиенте
      // Или можно сделать несколько запросов по одному ID
      const allStars = await this.getAll();
      return allStars.filter((star) => ids.includes(star.id));
    } catch (error) {
      // Если getAll уже вернул mock-данные, то catch не сработает
      // Но на всякий случай добавим fallback
      console.warn('API недоступен, используем mock-данные:', error);
      return starsData.filter((star) => ids.includes(star.id));
    }
  },
};
