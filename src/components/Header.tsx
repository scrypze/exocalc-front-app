import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { useEffect, useState } from 'react';
import './Header.css';

export const Header = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 545);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <header>
        <div className="main-header">
          <div className="header-content">
            <Link to="/">
              <img src={logoImage} alt="home" />
            </Link>
            <h1>Экзопланетный калькулятор</h1>
            {!isMobile ? (
              <Link to="/stars" className="header-nav-link">
                Звёзды
              </Link>
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
                  <Link to="/stars" className="nav-link-mobile">
                    Звёзды
                  </Link>
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

