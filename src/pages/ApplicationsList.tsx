import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { getAllSelectedStars, moderateSelectedStars } from '../slices/selectedStarsSlice';
import { getMe } from '../slices/authSlice';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import './ApplicationsList.css';

export const ApplicationsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { allApplications, loading, error } = useSelector((state: RootState) => state.selectedStars);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const isAstronomer = user?.role === 'astronomer' || user?.role === 'Astronomer';
  
  console.log('ApplicationsList - user:', user, 'isAstronomer:', isAstronomer, 'allApplications:', allApplications);
  
  const filteredApplications = useMemo(() => {
    if (!allApplications || allApplications.length === 0) {
      return [];
    }
    
    if (isAstronomer) {
      return allApplications;
    }
    
    return allApplications.filter((app: any) => app.creator_login === user?.login);
  }, [allApplications, isAstronomer, user?.login]);

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

  const handleModerate = async (id: number, action: 'complete' | 'decline') => {
    if (!window.confirm(`Вы уверены, что хотите ${action === 'complete' ? 'одобрить' : 'отклонить'} эту заявку?`)) {
      return;
    }

    if (!user?.id) {
      alert('Ошибка: не удалось получить ID пользователя');
      return;
    }

    try {
      await dispatch(moderateSelectedStars({ 
        id, 
        status: action === 'complete' ? 'completed' : 'declined',
        moderatorId: user.id
      })).unwrap();
      await dispatch(getAllSelectedStars());
      alert(`Заявка ${action === 'complete' ? 'одобрена' : 'отклонена'}!`);
      
      const currentPath = window.location.pathname;
      if (currentPath.includes(`/application/${id}`)) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Ошибка модерации заявки:', err);
      alert('Ошибка модерации заявки');
    }
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
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
                  {isAstronomer ? 'Заявок нет' : 'У вас нет заявок'}
                </td>
              </tr>
            ) : (
              filteredApplications.map((app: any) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ color: statusColors[app.status] || '#ffffff' }}
                    >
                      {statusLabels[app.status] || app.status}
                    </span>
                  </td>
                  <td>{app.scientist || '-'}</td>
                  <td>
                    {app.formed_at
                      ? new Date(app.formed_at).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : '-'
                    }
                  </td>
                  <td>{app.items_count || 0}</td>
                  <td>
                    <div className="table-actions">
                      <Link 
                        to={`/application/${app.id}`} 
                        className="table-link-button"
                      >
                        Открыть
                      </Link>
                      {isAstronomer && app.status === 'formed' && (
                        <>
                          <button
                            onClick={() => handleModerate(app.id, 'complete')}
                            className="table-action-button table-action-button-approve"
                          >
                            Одобрить
                          </button>
                          <button
                            onClick={() => handleModerate(app.id, 'decline')}
                            className="table-action-button table-action-button-decline"
                          >
                            Отклонить
                          </button>
                        </>
                      )}
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

