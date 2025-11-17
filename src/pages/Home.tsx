import { Link } from 'react-router-dom';
import planIcon from '../assets/cart.png';
import './Home.css';

export const Home = () => {
  return (
    <div className="main-content home-content">
      <div className="home-header">
        <h1 className="home-main-title">Экзопланетный калькулятор</h1>
        <p className="home-subtitle-text">
          Система изучения и анализа характеристик звёзд для исследования экзопланет<br />
          и космических объектов
        </p>
      </div>
      <div className="home-container">
        <div className="home-section">
          <div className="home-section-content">
            <img src={planIcon} alt="Рассчёт экзопланет" className="home-icon" />
            <h2 className="home-title">Рассчёт экзопланет</h2>
            <p className="home-description">
              Исследуйте удивительный мир звёзд: от ближайших к Солнцу до самых ярких на ночном небе. 
              Узнайте характеристики различных звёзд и их уникальные свойства.
            </p>
            <Link to="/stars" className="home-button">
              Начать рассчет экзопланет
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
