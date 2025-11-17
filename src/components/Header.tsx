import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { useEffect, useState } from 'react';
import './Header.css';

export const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 545);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <header>
        <div className="main-header">
          <div className="header-content">
            <Link to="/">
              <img src={logoImage} alt="home" />
            </Link>
            <h1>Экзопланетный калькулятор</h1>
          </div>
        </div>
      </header>
      <div className="gray-space">
        {!isMobile && (
          <div className="nav-buttons">
            <div className="nav-menu">
              <button
                type="button"
                className="nav-menu-btn"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
              >
                Меню
              </button>
              {isMenuOpen && (
                <div className="nav-menu-list">
                  <Link
                    to="/stars"
                    className="nav-menu-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Каталог звёзд
                  </Link>
                </div>
              )}
            </div>
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

