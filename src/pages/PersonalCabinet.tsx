import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { getMe, updateLogin, updatePassword } from '../slices/authSlice';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import './PersonalCabinet.css';

export const PersonalCabinet = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!user) {
      dispatch(getMe());
    }
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (user?.login) {
      setLogin(user.login);
      setNewLogin(user.login);
    }
  }, [user?.login]);

  const handleUpdateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newLogin || newLogin.trim() === '') {
      setError('Логин не может быть пустым');
      return;
    }

    if (newLogin === login) {
      setError('Новый логин должен отличаться от текущего');
      return;
    }

    try {
      await dispatch(updateLogin(newLogin)).unwrap();
      setSuccess('Логин успешно изменён!');
      setLogin(newLogin);
      await dispatch(getMe());
    } catch (err: any) {
      console.error('Ошибка изменения логина:', err);
      const errorMessage = typeof err === 'string' ? err : (err?.message || err?.toString() || 'Ошибка при изменении логина');
      setError(errorMessage);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password) {
      setError('Введите текущий пароль');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await dispatch(updatePassword({ oldPassword: password, newPassword })).unwrap();
      setSuccess('Пароль успешно изменён!');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Ошибка изменения пароля:', err);
      const errorMessage = typeof err === 'string' ? err : (err?.message || err?.toString() || 'Ошибка при изменении пароля');
      setError(errorMessage);
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

  return (
    <div className="main-content">
      <Breadcrumbs />
      <h1 className="page-title">Личный кабинет</h1>

      <div className="personal-cabinet-container">
        <div className="personal-cabinet-section">
          <h2>Текущие данные</h2>
          <div className="info-field">
            <label>Логин:</label>
            <span>{user?.login || '-'}</span>
          </div>
          <div className="info-field">
            <label>Роль:</label>
            <span>{user?.role === 'astronomer' ? 'Астроном' : 'Клиент'}</span>
          </div>
        </div>

        <div className="personal-cabinet-section">
          <h2>Изменить логин</h2>
          <form onSubmit={handleUpdateLogin} className="personal-cabinet-form">
            <div className="form-group">
              <label htmlFor="newLogin">Новый логин:</label>
              <input
                type="text"
                id="newLogin"
                value={newLogin}
                onChange={(e) => setNewLogin(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Изменить логин
            </button>
          </form>
        </div>

        <div className="personal-cabinet-section">
          <h2>Изменить пароль</h2>
          <form onSubmit={handleUpdatePassword} className="personal-cabinet-form">
            <div className="form-group">
              <label htmlFor="password">Текущий пароль:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Новый пароль:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите новый пароль:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                Показать пароли
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Изменить пароль
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message" style={{ color: '#ff6b6b', padding: '10px', marginTop: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{ color: '#10b981', padding: '10px', marginTop: '20px' }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

