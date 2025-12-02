import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { getStarById } from '../slices/starsSlice';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import defaultStarImage from '../assets/base.jpeg';
import './StarDetail.css';

export const StarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { selectedStar, loading, error } = useSelector((state: RootState) => state.stars);

  useEffect(() => {
    if (id) {
      dispatch(getStarById(Number(id)));
      }
  }, [id, dispatch]);

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

  if (error || (!loading && !selectedStar)) {
    return (
      <div className="main-content">
        <Breadcrumbs />
        <h1 className="page-title">{error || 'Звезда не найдена'}</h1>
      </div>
    );
  }

  if (!selectedStar) {
    return null;
  }

  const handleBack = () => {
    navigate('/stars');
  };

  const star = {
    title: selectedStar.title || '',
    imagePath: selectedStar.image_path || '',
    spectralType: selectedStar.spectral_type || '',
    temperature: selectedStar.temperature || '',
    radius: selectedStar.radius || '',
    mass: selectedStar.mass || '',
    luminosity: selectedStar.luminosity || '',
    metallicity: selectedStar.metallicity || '',
    age: selectedStar.age || '',
    distance: selectedStar.distance || '',
  };

  return (
    <div className="main-content">
      <Breadcrumbs currentLabel={star.title} />
      <h1 className="star-title">{star.title}</h1>

      <div className="info-panel">
        <div className="star-image-container">
          <img 
            src={star.imagePath && star.imagePath.trim() !== '' ? star.imagePath : defaultStarImage} 
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

