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

      <div className="applications-table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Статус</th>
              <th>Учёный</th>
              <th>Дата формирования</th>
              <th>Количество звёзд</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredSelectedStars.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
                      {isAstronomer ? 'Заявок нет' : 'У вас нет заявок'}
                    </td>
                  </tr>
                ) : (
                  filteredSelectedStars.map((selectedStar: any) => (
                    <tr key={selectedStar.id}>
                      <td>{selectedStar.id}</td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ color: statusColors[selectedStar.status] || '#ffffff' }}
                        >
                          {statusLabels[selectedStar.status] || selectedStar.status}
                        </span>
                      </td>
                      <td>{selectedStar.scientist || '-'}</td>
                      <td>
                        {selectedStar.formed_at
                          ? new Date(selectedStar.formed_at).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          : '-'
                        }
                      </td>
                      <td>{selectedStar.items_count || 0}</td>
                      <td>
                        <div className="table-actions">
                          <Link 
                            to={`/application/${selectedStar.id}`} 
                            className="table-link-button"
                          >
                            Открыть
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

