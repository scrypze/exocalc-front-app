import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { login, register, registerAstronomer, clearError, getMe } from '../slices/authSlice';
import './Login.css';

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isAstronomerMode, setIsAstronomerMode] = useState(false);
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/stars');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [isLoginMode, isAstronomerMode, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const loginFromForm = formData.get('login') as string;
    const passwordFromForm = formData.get('password') as string;
    
    const credentials = {
      login: loginFromForm || loginValue,
      pass: passwordFromForm || password,
    };
    
    console.log('Submitting credentials - login:', credentials.login, 'pass length:', credentials.pass.length);

    try {
      if (isLoginMode) {
        await dispatch(login(credentials)).unwrap();
        await dispatch(getMe());
      } else {
        if (isAstronomerMode) {
          await dispatch(registerAstronomer(credentials)).unwrap();
          setStatusMessage('Регистрация астронома прошла успешно! Теперь вы можете войти.');
          setIsLoginMode(true);
          setLoginValue('');
          setPassword('');
        } else {
          await dispatch(register(credentials)).unwrap();
          setStatusMessage('Регистрация прошла успешно! Теперь вы можете войти.');
          setIsLoginMode(true);
          setLoginValue('');
          setPassword('');
        }
      }
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isLoginMode ? 'Авторизация' : 'Регистрация'}</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      {statusMessage && (
        <div className="success-message">
          {statusMessage}
        </div>
      )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login">Логин:</label>
            <input
              type="text"
              id="login"
              name="login"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {!isLoginMode && (
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={isAstronomerMode}
                  onChange={(e) => setIsAstronomerMode(e.target.checked)}
                  disabled={loading}
                />
                Зарегистрироваться как астроном
              </label>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className="toggle-mode">
          {isLoginMode ? (
            <p>
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className="link-btn"
                disabled={loading}
              >
                Зарегистрироваться
              </button>
            </p>
          ) : (
            <p>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(true);
                  setIsAstronomerMode(false);
                }}
                className="link-btn"
                disabled={loading}
              >
                Войти
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

