import { Link } from 'react-router-dom';
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
              <img src="/img/image.png" alt="home" />
            </Link>
            <h1>Экзопланетный калькулятор</h1>
          </div>
        </div>
      </header>
      <div className="gray-space">
        {!isMobile && (
          <div className="nav-buttons">
            <Link to="/stars" className="nav-btn">
              Каталог звёзд
            </Link>
          </div>
        )}
        {isMobile && (
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
                Каталог звёзд
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

