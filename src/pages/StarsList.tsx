import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import type { Star } from '../types';
import { StarCard } from '../components/StarCard/StarCard';
import { SearchForm } from '../components/SearchForm/SearchForm';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import {
  setSearchQueryAction,
  setMassRangeAction,
  useSearchQuery,
  useMassRange,
} from '../slices/filterSlice';
import { getStarsList } from '../slices/starsSlice';
import { getSelectedStarsCount, addStarToSelected, createDraftSelectedStars, getSelectedStarsById } from '../slices/selectedStarsSlice';
import type { ModelStar } from '../api/Api';
import './StarsList.css';

const parseMassValue = (mass: string) => {
  if (!mass) {
    return null;
  }
  const sanitized = mass.replace(',', '.');
  const match = sanitized.match(/[0-9]+(\.[0-9]+)?/);
  return match ? parseFloat(match[0]) : null;
};

const mapStarFromAPI = (star: ModelStar): Star => ({
  id: star.id || 0,
  title: star.title || '',
  description: star.description || '',
  imagePath: star.image_path?.replace(/^http:\/\/localhost:9000/, '/minio') || '',
  spectralType: star.spectral_type || '',
  temperature: star.temperature || '',
  radius: star.radius || '',
  mass: star.mass || '',
  luminosity: star.luminosity || '',
  metallicity: star.metallicity || '',
  age: star.age || '',
  distance: star.distance || '',
});

export const StarsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const searchQuery = useSearchQuery();
  const massRange = useMassRange();
  
  const { stars: starsFromAPI, loading, error } = useSelector((state: RootState) => state.stars);
  const { count: selectedCount, currentDraftId, selectedStars } = useSelector((state: RootState) => state.selectedStars);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localMassMin, setLocalMassMin] = useState('');
  const [localMassMax, setLocalMassMax] = useState('');
  const [filteredStars, setFilteredStars] = useState<Star[]>([]);
  const [starsInDraft, setStarsInDraft] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    setLocalMassMin(massRange.min || '');
    setLocalMassMax(massRange.max || '');
  }, [massRange]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getSelectedStarsCount()).then((result) => {
        const countResult = result.payload as any;
        const draftId = countResult?.selected_stars_id || currentDraftId;
        if (draftId) {
          dispatch(getSelectedStarsById(draftId));
        }
      });
    }
  }, [isAuthenticated, dispatch, currentDraftId]);

  useEffect(() => {
    if (selectedStars && currentDraftId) {
      const data = selectedStars as any;
      const items = data['selected-stars-items'] || data.calculate_exoplanets || [];
      const starIds = new Set<number>();
      items.forEach((item: any) => {
        const starData = item.star || item;
        const starId = starData.id || starData.ID || 0;
        if (starId) {
          starIds.add(starId);
        }
      });
      setStarsInDraft(starIds);
    } else {
      setStarsInDraft(new Set());
    }
  }, [selectedStars, currentDraftId]);

  const performSearch = (
    stars: Star[],
    query: string,
    minValueRaw: string,
    maxValueRaw: string
  ) => {
    const filteredByTitle = query
      ? stars.filter((star) => star.title.toLowerCase().includes(query.toLowerCase()))
      : stars;

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

    setFilteredStars(filteredByMass);
  };

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    dispatch(getStarsList(trimmedQuery || undefined));
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (starsFromAPI) {
      const mappedStars = starsFromAPI.map(mapStarFromAPI);
      performSearch(
        mappedStars,
          searchQuery.trim(),
          massRange.min.trim(),
          massRange.max.trim()
        );
      }
  }, [starsFromAPI, searchQuery, massRange.min, massRange.max]);

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

  const handleAddStar = async (starId: number) => {
    if (!isAuthenticated) {
      alert('Для добавления звезды в заявку необходимо авторизоваться');
      navigate('/login');
      return;
    }

    try {
      if (!currentDraftId) {
        await dispatch(createDraftSelectedStars()).unwrap();
        await dispatch(getSelectedStarsCount()).unwrap();
      }
      
      await dispatch(addStarToSelected(starId)).unwrap();
      
      const countResult = await dispatch(getSelectedStarsCount()).unwrap();
      const draftId = (countResult as any).selected_stars_id || currentDraftId;
      if (draftId) {
        await dispatch(getSelectedStarsById(draftId));
      }
      
      alert('Звезда добавлена в заявку!');
    } catch (err) {
      console.error('Ошибка добавления звезды:', err);
      alert('Ошибка добавления звезды в заявку');
    }
  };

  const handleGoToSelectedStars = async () => {
    console.log('Клик по корзине, currentDraftId:', currentDraftId, 'selectedCount:', selectedCount);
    
    try {
      let draftId = currentDraftId;
      if (!draftId && selectedCount > 0) {
        const countResult = await dispatch(getSelectedStarsCount()).unwrap();
        draftId = countResult.selected_stars_id || null;
        console.log('Обновленный draftId после getSelectedStarsCount:', draftId);
      }
      
      if (draftId) {
        await dispatch(getSelectedStarsById(draftId)).unwrap();
        navigate(`/selected-stars/${draftId}`);
      } else {
        console.warn('currentDraftId не установлен, невозможно перейти к заявке');
        alert('Заявка не найдена. Создайте новую заявку, добавив звезду.');
      }
    } catch (err) {
      console.error('Ошибка загрузки заявки:', err);
      alert('Не удалось загрузить заявку');
    }
  };

  return (
    <div className="main-content">
      <Breadcrumbs />
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
            {filteredStars.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px', gridColumn: '1 / -1' }}>
                Звёзды не найдены
              </div>
            ) : (
                  filteredStars.map((star) => (
                <StarCard
                  key={star.id}
                  star={star}
                      onAddToSelectedStars={handleAddStar}
                      isAuthenticated={isAuthenticated}
                      isAddedToSelectedStars={starsInDraft.has(star.id)}
                />
              ))
            )}
          </div>
          {isAuthenticated && selectedCount > 0 && (
            <div 
              className="selected-stars-fab" 
              onClick={handleGoToSelectedStars} 
              style={{ 
                cursor: 'pointer',
                pointerEvents: 'auto',
                opacity: 1
              }}
            >
              <span className="selected-stars-icon"></span>
              <span className="selected-stars-count">{selectedCount}</span>
            </div>
          )}
          {isAuthenticated && selectedCount === 0 && (
            <div 
              className="selected-stars-fab" 
              style={{ 
                cursor: 'not-allowed',
                pointerEvents: 'none',
                opacity: 0.5
              }}
            >
            <span className="selected-stars-icon"></span>
              <span className="selected-stars-count">{selectedCount}</span>
          </div>
          )}
        </>
      )}
    </div>
  );
};

