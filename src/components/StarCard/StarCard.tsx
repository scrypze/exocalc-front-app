import { Link } from 'react-router-dom';
import type { Star } from '../../types';
import defaultStarImage from '../../assets/base.jpeg';
import './StarCard.css';

interface StarCardProps {
  star: Star;
  onAddToApplication?: (starId: number) => void;
  onRemoveFromApplication?: (starId: number) => void;
  isAuthenticated?: boolean;
  showRemoveButton?: boolean;
  isAddedToApplication?: boolean;
}

export const StarCard = ({ 
  star, 
  onAddToApplication, 
  onRemoveFromApplication, 
  isAuthenticated = false,
  showRemoveButton = false,
  isAddedToApplication = false
}: StarCardProps) => {
  const imageSrc = star.imagePath && star.imagePath.trim() !== '' 
    ? star.imagePath 
    : defaultStarImage;

  return (
    <div className="star-card">
      <div className="star-image">
        <img src={imageSrc} alt={star.title} />
      </div>
      <div className="star-info">
        <h3 className="star-title">{star.title}</h3>
        <p className="star-description">{star.description}</p>
        <div className="star-card-buttons">
        <Link to={`/star/${star.id}`} className="details-button">
          Подробнее
        </Link>
          {isAuthenticated && onAddToApplication && !showRemoveButton && !isAddedToApplication && (
            <button
              onClick={() => onAddToApplication(star.id)}
              className="add-to-application-button"
            >
              В заявку
            </button>
          )}
          {isAuthenticated && isAddedToApplication && !showRemoveButton && (
            <span className="star-added-indicator">В заявке</span>
          )}
          {showRemoveButton && onRemoveFromApplication && (
            <button
              onClick={() => onRemoveFromApplication(star.id)}
              className="remove-from-application-button"
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
