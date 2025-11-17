import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
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
        <div className="nav-buttons">
          <Link to="/stars" className="nav-btn">
            Каталог звёзд
          </Link>
        </div>
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
      </div>
    </>
  );
};

