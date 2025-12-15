import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { getAllSelectedStars } from '../slices/selectedStarsSlice';
import { getMe } from '../slices/authSlice';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import './SelectedStarsList.css';

export const SelectedStarsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { allSelectedStars, loading, error } = useSelector((state: RootState) => state.selectedStars);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [formedDate, setFormedDate] = useState('');
  const [calculationDate, setCalculationDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const isAstronomer = user?.role === 'astronomer' || user?.role === 'Astronomer';
  
  const filteredSelectedStars = useMemo(() => {
    if (!allSelectedStars || allSelectedStars.length === 0) {
      return [];
    }

    let result = isAstronomer
      ? allSelectedStars
      : allSelectedStars.filter((selectedStar: any) => selectedStar.creator_login === user?.login);

    if (calculationDate) {
      result = result.filter((selectedStar: any) => {
        const raw =
          selectedStar.calculation_date ||
          selectedStar.calculationDate ||
          selectedStar.date ||
          selectedStar.Date;

        if (!raw) {
          return false;
        }

        if (typeof raw === 'string') {
          return raw.slice(0, 10) === calculationDate;
        }

        try {
          const iso = new Date(raw).toISOString().slice(0, 10);
          return iso === calculationDate;
        } catch {
          return false;
        }
      });
    }

    return result;
  }, [allSelectedStars, isAstronomer, user?.login, calculationDate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!user || !user.id || !user.role) {
      dispatch(getMe()).then(() => {
        dispatch(getAllSelectedStars());
      });
    } else {
      dispatch(getAllSelectedStars());
    }
  }, [dispatch, navigate, isAuthenticated, user]);

  useEffect(() => {
    const filters: { date_from?: string; date_to?: string; status?: string } = {};

    if (formedDate) {
      filters.date_from = formedDate;
      filters.date_to = formedDate;
    }
    if (statusFilter) {
      filters.status = statusFilter;
    }

    if (Object.keys(filters).length === 0) {
      dispatch(getAllSelectedStars());
      return;
    }

    dispatch(getAllSelectedStars(filters));
  }, [dispatch, formedDate, statusFilter]);

  const handleResetFilters = () => {
    setFormedDate('');
    setCalculationDate('');
    setStatusFilter('');
  };

  const statusLabels: { [key: string]: string } = {
    draft: 'Черновик',
    formed: 'Сформирован',
    completed: 'Завершен',
    declined: 'Отклонен',
  };

  const statusColors: { [key: string]: string } = {
    draft: '#ffd700',
    formed: '#3b82f6',
    completed: '#10b981',
    declined: '#ef4444',
  };


  if (loading) {
    return (
      <div className="main-content">
        <Breadcrumbs />
        <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <Breadcrumbs />
        <div style={{ textAlign: 'center', color: '#ff6b6b', padding: '20px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <Breadcrumbs />
      <h1 className="page-title">{isAstronomer ? 'Все заявки' : 'Мои заявки'}</h1>

      <div className="selected-stars-filters">
        <div className="selected-stars-filters-row">
          <div className="selected-stars-filter-field">
            <label htmlFor="date-from" className="selected-stars-filter-label">
              Дата формирования
            </label>
            <input
              id="date-from"
              type="date"
              className="selected-stars-filter-input"
              value={formedDate}
              onChange={(e) => setFormedDate(e.target.value)}
            />
          </div>
          <div className="selected-stars-filter-field">
            <label htmlFor="date-to" className="selected-stars-filter-label">
              Дата расчёта
            </label>
            <input
              id="date-to"
              type="date"
              className="selected-stars-filter-input"
              value={calculationDate}
              onChange={(e) => setCalculationDate(e.target.value)}
            />
          </div>
          <div className="selected-stars-filter-field">
            <label htmlFor="status" className="selected-stars-filter-label">
              Статус
            </label>
            <select
              id="status"
              className="selected-stars-filter-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Все</option>
              <option value="formed">Сформирован</option>
              <option value="completed">Завершен</option>
              <option value="declined">Отклонен</option>
            </select>
          </div>
          <div className="selected-stars-filter-buttons">
            <button
              type="button"
              className="selected-stars-filter-button secondary"
              onClick={handleResetFilters}
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      {filteredSelectedStars.length > 0 && (
        <div className="selected-stars-cards-header">
          <div className="selected-stars-header-id">ID</div>
          <div className="selected-stars-header-status">Статус</div>
          <div className="selected-stars-header-scientist">Учёный</div>
          <div className="selected-stars-header-formed">Дата формирования</div>
          <div className="selected-stars-header-date">Дата расчёта</div>
          <div className="selected-stars-header-count">Количество результатов</div>
          <div className="selected-stars-header-actions">Действия</div>
        </div>
      )}

      {filteredSelectedStars.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
          {isAstronomer ? 'Заявок нет' : 'У вас нет заявок'}
        </div>
      ) : (
        <div className="selected-stars-cards-list">
          {filteredSelectedStars.map((selectedStar: any) => (
            <div key={selectedStar.id} className="selected-stars-card-item">
              <div className="selected-stars-card-meta-row">
                <div className="selected-stars-card-meta-item">
                  <span className="selected-stars-card-value">{selectedStar.id}</span>
                </div>
                <div className="selected-stars-card-meta-item">
                  <span
                    className="selected-stars-card-status"
                    style={{ color: statusColors[selectedStar.status] || '#ffffff' }}
                  >
                    {statusLabels[selectedStar.status] || selectedStar.status}
                  </span>
                </div>
                <div className="selected-stars-card-meta-item">
                  <span className="selected-stars-card-value">{selectedStar.scientist || '-'}</span>
                </div>
                <div className="selected-stars-card-meta-item">
                  <span className="selected-stars-card-value">
                    {selectedStar.formed_at || selectedStar.formedAt || selectedStar.FormedAt
                      ? new Date(
                          selectedStar.formed_at || selectedStar.formedAt || selectedStar.FormedAt,
                        ).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : '-'}
                  </span>
                </div>
                <div className="selected-stars-card-meta-item">
                  <span className="selected-stars-card-value">
                    {selectedStar.calculation_date || selectedStar.calculationDate || selectedStar.date || selectedStar.Date
                      ? new Date(selectedStar.calculation_date || selectedStar.calculationDate || selectedStar.date || selectedStar.Date).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : '-'}
                  </span>
                </div>
                <div className="selected-stars-card-meta-item">
                  <span className="selected-stars-card-value">
                    {selectedStar.status === 'completed' ? selectedStar.items_count || 0 : 0}
                  </span>
                </div>
                <div className="selected-stars-card-meta-item selected-stars-card-actions">
                  <Link
                    to={`/selected-stars/${selectedStar.id}`}
                    className="selected-stars-card-link"
                  >
                    Открыть
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

