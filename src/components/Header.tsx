import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logout } from '../slices/authSlice';
import logoImage from '../assets/logo.png';
import { useEffect, useState } from 'react';
import './Header.css';

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 545);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <header>
        <div className="main-header">
          <div className="header-content">
            <Link to="/">
              <img src={logoImage} alt="home" />
            </Link>
            {!isMobile ? (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {isAuthenticated && (
                  <>
                    <Link to="/personal-cabinet" className="header-nav-link">
                      Личный кабинет
                    </Link>
                    <Link to="/selected-stars" className="header-nav-link">
                      Заявки
                    </Link>
                  </>
                )}
              <Link to="/stars" className="header-nav-link">
                Звёзды
              </Link>
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="header-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    Выйти
                  </button>
                ) : (
                  <Link to="/login" className="header-nav-link">
                    Войти
                  </Link>
                )}
              </div>
            ) : (
              <div 
                className="nav-mobile-wrapper"
                onClick={(event) => event.currentTarget.classList.toggle('active')}
              >
                <div className="nav-mobile-target" />
                <div 
                  className="nav-mobile-menu"
                  onClick={(event) => event.stopPropagation()}
                >
                  {isAuthenticated && (
                    <>
                      <Link to="/personal-cabinet" className="nav-link-mobile">
                        Личный кабинет
                      </Link>
                      <Link to="/selected-stars" className="nav-link-mobile">
                        Заявки
                      </Link>
                    </>
                  )}
                  <Link to="/stars" className="nav-link-mobile">
                    Звёзды
                  </Link>
                  {isAuthenticated ? (
                    <button onClick={handleLogout} className="nav-link-mobile" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                      Выйти
                    </button>
                  ) : (
                    <Link to="/login" className="nav-link-mobile">
                      Войти
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="gray-space">
      </div>
    </>
  );
};

