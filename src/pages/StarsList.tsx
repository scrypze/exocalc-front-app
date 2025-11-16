import { useState, useEffect, useRef } from 'react';
import type { Star } from '../types';
import { starsService } from '../modules/stars/starsService';
import { starFilters } from '../modules/stars/starFilters';
import { StarCard } from '../components/StarCard/StarCard';
import { SearchForm } from '../components/SearchForm/SearchForm';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import './StarsList.css';

export const StarsList = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastSearchQuery = useRef<string>('');

  useEffect(() => {
    const loadStars = async () => {
      try {
        setLoading(true);
        setError(null);
        const allStars = await starsService.getAll();
        setStars(allStars);
        lastSearchQuery.current = '';
      } catch (err) {
        setError('Ошибка загрузки звёзд. Проверьте подключение к API.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStars();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedQuery = searchQuery.trim();
    
    // Если запрос не изменился, не делаем новый запрос
    if (lastSearchQuery.current === normalizedQuery) {
      console.log('Поиск с тем же запросом, пропускаем');
      return;
    }

    console.log('Выполняем новый поиск:', normalizedQuery);
    try {
      setLoading(true);
      setError(null);
      
      // Если запрос пустой, загружаем все звёзды
      const filtered = normalizedQuery 
        ? await starFilters.byTitle(normalizedQuery)
        : await starsService.getAll();
      
      setStars(filtered);
      lastSearchQuery.current = normalizedQuery;
    } catch (err) {
      setError('Ошибка поиска звёзд.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <Breadcrumbs />
      <h1 className="page-title">Звёзды</h1>
      <SearchForm
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      {loading && <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>Загрузка...</div>}
      {error && <div style={{ textAlign: 'center', color: '#ff6b6b', padding: '20px' }}>{error}</div>}
      
      {!loading && !error && (
        <>
          <div className="stars-grid">
            {stars.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px', gridColumn: '1 / -1' }}>
                Звёзды не найдены
              </div>
            ) : (
              stars.map((star) => (
                <StarCard
                  key={star.id}
                  star={star}
                />
              ))
            )}
          </div>
          <div className="selected-stars-fab">
            <span className="selected-stars-icon"></span>
            <span className="selected-stars-count">0</span>
          </div>
        </>
      )}
    </div>
  );
};

