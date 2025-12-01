import { useState } from 'react';
import planIcon from '../assets/cart.png';
import './Home.css';

const featureCards = [
  {
    title: 'Рассчёт экзопланет',
    description:
      'Исследуйте удивительный мир звёзд: от ближайших к Солнцу до самых ярких на ночном небе. Узнайте характеристики различных звёзд и их уникальные свойства.',
    icon: planIcon,
  },
  {
    title: 'Звёзды',
    description:
      'Быстрая навигация по каталогу звёзд, фильтрация по характеристикам и формирование подборок для исследований.',
    icon: planIcon,
  },
  {
    title: 'Аналитика наблюдений',
    description:
      'Сравнивайте параметры звёзд, оценивайте массу, радиус и светимость, формируйте отчёты.',
    icon: planIcon,
  },
];

export const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + featureCards.length) % featureCards.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % featureCards.length);
  };

  const activeFeature = featureCards[activeIndex];

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
        <div className="home-slider">
          <button
            type="button"
            className="slider-arrow"
            onClick={handlePrev}
            aria-label="Предыдущее окно"
          >
            ‹
          </button>
          <div className="home-section">
            <div className="home-section-content">
              <img src={activeFeature.icon} alt={activeFeature.title} className="home-icon" />
              <h2 className="home-title">{activeFeature.title}</h2>
              <p className="home-description">{activeFeature.description}</p>
            </div>
          </div>
          <button
            type="button"
            className="slider-arrow"
            onClick={handleNext}
            aria-label="Следующее окно"
          >
            ›
          </button>
        </div>
        <div className="slider-dots" aria-label="Навигация по карточкам">
          {featureCards.map((feature, index) => (
            <button
              key={feature.title}
              type="button"
              className={`slider-dot ${index === activeIndex ? 'active' : ''}`}
              aria-label={`Показать раздел «${feature.title}»`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
