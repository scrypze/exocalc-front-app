import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Star } from '../types';
import { starsService } from '../modules/stars/starsService';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import './StarDetail.css';

export const StarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [star, setStar] = useState<Star | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStar = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const starData = await starsService.getById(Number(id));
        if (starData) {
          setStar(starData);
        } else {
          setError('Звезда не найдена');
        }
      } catch (err) {
        setError('Ошибка загрузки звезды. Проверьте подключение к API.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStar();
  }, [id]);

  if (loading) {
    return (
      <div className="main-content">
        <Breadcrumbs />
        <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
          Загрузка...
        </div>
      </div>
    );
  }

  if (error || !star) {
    return (
      <div className="main-content">
        <Breadcrumbs />
        <h1 className="page-title">{error || 'Звезда не найдена'}</h1>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/stars');
  };

  return (
    <div className="main-content">
      <Breadcrumbs currentLabel={star.title} />
      <h1 className="star-title">{star.title}</h1>

      <div className="info-panel">
        <div className="star-image-container">
          <img 
            src={star.imagePath && star.imagePath.trim() !== '' ? star.imagePath : '/img/base.jpeg'} 
            alt={star.title} 
            className="star-image" 
          />
        </div>
        <div className="star-properties">
          <div className="property-row">
            <span className="property-name">Спектральный тип</span>
            <span className="property-value">{star.spectralType}</span>
          </div>
          <div className="property-row">
            <span className="property-name">Эффективная температура</span>
            <span className="property-value">{star.temperature}</span>
          </div>
          <div className="property-row">
            <span className="property-name">Радиус</span>
            <span className="property-value">{star.radius}</span>
          </div>
          <div className="property-row">
            <span className="property-name">Масса</span>
            <span className="property-value">{star.mass}</span>
          </div>
          <div className="property-row">
            <span className="property-name">Светимость</span>
            <span className="property-value">{star.luminosity}</span>
          </div>
          <div className="property-row">
            <span className="property-name">Металличность [Fe/H]</span>
            <span className="property-value">{star.metallicity}</span>
          </div>
          <div className="property-row">
            <span className="property-name">Возраст</span>
            <span className="property-value">{star.age}</span>
          </div>
          <div className="property-row">
            <span className="property-name">Расстояние</span>
            <span className="property-value">{star.distance}</span>
          </div>
        </div>
      </div>

      <button onClick={handleBack} className="back-button">
        <span className="back-arrow">‹‹</span>
        Назад
      </button>
    </div>
  );
};

