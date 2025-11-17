import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Star } from '../types';
import { starsService } from '../modules/stars/starsService';
import { starFilters } from '../modules/stars/starFilters';
import { StarCard } from '../components/StarCard/StarCard';
import { SearchForm } from '../components/SearchForm/SearchForm';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import {
  setSearchQueryAction,
  setMassRangeAction,
  useSearchQuery,
  useMassRange,
} from '../slices/filterSlice';
import './StarsList.css';

const parseMassValue = (mass: string) => {
  if (!mass) {
    return null;
  }
  const sanitized = mass.replace(',', '.');
  const match = sanitized.match(/[0-9]+(\.[0-9]+)?/);
  return match ? parseFloat(match[0]) : null;
};

export const StarsList = () => {
  const dispatch = useDispatch();
  const searchQuery = useSearchQuery();
  const massRange = useMassRange();
  const [stars, setStars] = useState<Star[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localMassMin, setLocalMassMin] = useState('');
  const [localMassMax, setLocalMassMax] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    setLocalMassMin(massRange.min || '');
    setLocalMassMax(massRange.max || '');
  }, [massRange]);

  const performSearch = async (
    query: string,
    minValueRaw: string,
    maxValueRaw: string
  ) => {
    const filteredByTitle = query
      ? await starFilters.byTitle(query)
      : await starsService.getAll();

    let minValue = minValueRaw !== '' ? Number(minValueRaw) : null;
    let maxValue = maxValueRaw !== '' ? Number(maxValueRaw) : null;

    if (minValue !== null && Number.isNaN(minValue)) {
      minValue = null;
    }

    if (maxValue !== null && Number.isNaN(maxValue)) {
      maxValue = null;
    }

    if (minValue !== null && maxValue !== null && minValue > maxValue) {
      const temp = minValue;
      minValue = maxValue;
      maxValue = temp;
    }

    const filteredByMass = filteredByTitle.filter((star) => {
      if (minValue === null && maxValue === null) {
        return true;
      }
      const massValue = parseMassValue(star.mass);
      if (massValue === null) {
        return false;
      }
      if (minValue !== null && massValue < minValue) {
        return false;
      }
      if (maxValue !== null && massValue > maxValue) {
        return false;
      }
      return true;
    });

    setStars(filteredByMass);
  };

  useEffect(() => {
    const runSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        await performSearch(
          searchQuery.trim(),
          massRange.min.trim(),
          massRange.max.trim()
        );
      } catch (err) {
        setError('Ошибка поиска звёзд.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [searchQuery, massRange.min, massRange.max]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedQuery = localSearchQuery.trim();
    const normalizedMin = localMassMin.trim();
    const normalizedMax = localMassMax.trim();

    dispatch(setSearchQueryAction(normalizedQuery));
    dispatch(setMassRangeAction({ min: normalizedMin, max: normalizedMax }));
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const handleMassMinChange = (value: string) => {
    setLocalMassMin(value);
  };

  const handleMassMaxChange = (value: string) => {
    setLocalMassMax(value);
  };

  return (
    <div className="main-content">
      <Breadcrumbs />
      <h1 className="page-title">Звёзды</h1>
      <SearchForm
        searchQuery={localSearchQuery}
        massMin={localMassMin}
        massMax={localMassMax}
        onSearchChange={handleSearchChange}
        onMassMinChange={handleMassMinChange}
        onMassMaxChange={handleMassMaxChange}
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

