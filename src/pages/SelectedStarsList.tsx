import { useEffect, useMemo } from 'react';
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
  
  const isAstronomer = user?.role === 'astronomer' || user?.role === 'Astronomer';
  
  const filteredSelectedStars = useMemo(() => {
    if (!allSelectedStars || allSelectedStars.length === 0) {
      return [];
    }
    
    if (isAstronomer) {
      return allSelectedStars;
    }
    
    return allSelectedStars.filter((selectedStar: any) => selectedStar.creator_login === user?.login);
  }, [allSelectedStars, isAstronomer, user?.login]);

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

      {filteredSelectedStars.length > 0 && (
        <div className="selected-stars-cards-header">
          <div className="selected-stars-header-id">ID</div>
          <div className="selected-stars-header-status">Статус</div>
          <div className="selected-stars-header-scientist">Учёный</div>
          <div className="selected-stars-header-date">Дата расчётов</div>
          <div className="selected-stars-header-count">Количество звёзд</div>
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
                    {selectedStar.date || selectedStar.Date
                      ? new Date(selectedStar.date || selectedStar.Date).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : '-'}
                  </span>
                </div>
                <div className="selected-stars-card-meta-item">
                  <span className="selected-stars-card-value">{selectedStar.items_count || 0}</span>
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

