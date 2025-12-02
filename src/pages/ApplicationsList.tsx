import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { getAllSelectedStars } from '../slices/selectedStarsSlice';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import './ApplicationsList.css';

export const ApplicationsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { allApplications, loading, error } = useSelector((state: RootState) => state.selectedStars);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(getAllSelectedStars());
  }, [dispatch, navigate, isAuthenticated]);

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
      <h1 className="page-title">Мои заявки</h1>

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
            {allApplications.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
                  У вас нет заявок
                </td>
              </tr>
            ) : (
              allApplications.map((app: any) => (
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
                    <Link 
                      to={`/application/${app.id}`} 
                      className="table-link-button"
                    >
                      Открыть
                    </Link>
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

