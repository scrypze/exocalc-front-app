import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import {
  getSelectedStarsById,
  updateSelectedStars,
  formSelectedStars,
  deleteSelectedStars,
  removeStarFromSelected,
  updateStarComment,
} from '../slices/selectedStarsSlice';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import type { Star } from '../types';
import defaultStarImage from '../assets/base.jpeg';
import './SelectedStars.css';

export const SelectedStars = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { selectedStars, loading, error } = useSelector((state: RootState) => state.selectedStars);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [scientistName, setScientistName] = useState('');
  const [calculationDate, setCalculationDate] = useState('');
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [localMessage, setLocalMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const selectedStarsData = selectedStars as any;
  const isDraft = (selectedStarsData?.Status || selectedStarsData?.status) === 'draft';
  const isAstronomer = user?.role === 'astronomer';

  useEffect(() => {
    if (id) {
      dispatch(getSelectedStarsById(Number(id)));
    }
  }, [id, dispatch]);


  useEffect(() => {
    if (selectedStars) {
      const data = selectedStars as any;
      
      setScientistName(data.Scientist || '');
      
      if (data.Date) {
        const date = new Date(data.Date);
        setCalculationDate(date.toISOString().split('T')[0]);
      } else {
        setCalculationDate('');
      }
      
      const initialComments: { [key: number]: string } = {};
      const items = data['selected-stars-items'] || data.calculate_exoplanets || [];
      items.forEach((item: any) => {
        const starData = item.star || item;
        const starId = starData?.id ?? starData?.ID ?? item.star_id ?? item.ID;
        if (!starId) {
          return;
        }
        const comment =
          item.comment ??
          item.Comment ??
          starData?.comment ??
          starData?.Comment ??
          '';
        initialComments[starId] = comment || '';
      });
      setComments(initialComments);
    }
  }, [selectedStars]);

  const handleSave = async () => {
    if (!id) return;

    try {
      await dispatch(
        updateSelectedStars({
          id: Number(id),
          data: {
            scientist: scientistName,
            date: calculationDate,
          },
        })
      ).unwrap();
      
      const saveCommentPromises = Object.keys(comments).map(starId =>
        dispatch(
          updateStarComment({
            selectedStarsId: Number(id),
            starId: Number(starId),
            comment: comments[Number(starId)] || '',
          })
        ).unwrap()
      );
      await Promise.all(saveCommentPromises);

      dispatch(getSelectedStarsById(Number(id)));
      setLocalMessage({ type: 'success', text: 'Заявка сохранена' });
    } catch (err) {
      console.error('Ошибка сохранения заявки:', err);
      setLocalMessage({ type: 'error', text: 'Ошибка сохранения заявки' });
    }
  };

  const handleForm = async () => {
    if (!id) return;

    if (!scientistName || !calculationDate) {
      setLocalMessage({ type: 'info', text: 'Укажите имя ученого и дату расчета' });
      return;
    }

    try {
      await dispatch(
        updateSelectedStars({
          id: Number(id),
          data: {
            scientist: scientistName,
            date: calculationDate,
          },
        })
      ).unwrap();

      await dispatch(formSelectedStars(Number(id))).unwrap();
      setLocalMessage({ type: 'success', text: 'Заявка сформирована' });
      
      dispatch(getSelectedStarsById(Number(id)));
    } catch (err) {
      console.error('Ошибка формирования заявки:', err);
      setLocalMessage({ type: 'error', text: 'Ошибка формирования заявки' });
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      return;
    }

    try {
      await dispatch(deleteSelectedStars(Number(id))).unwrap();
      setLocalMessage({ type: 'success', text: 'Заявка удалена' });
      navigate('/stars');
    } catch (err) {
      console.error('Ошибка удаления заявки:', err);
      setLocalMessage({ type: 'error', text: 'Ошибка удаления заявки' });
    }
  };

  const handleRemoveStar = async (starId: number) => {
    try {
      await dispatch(removeStarFromSelected(starId)).unwrap();
      if (id) {
        dispatch(getSelectedStarsById(Number(id)));
      }
    } catch (err) {
      console.error('Ошибка удаления звезды:', err);
      setLocalMessage({ type: 'error', text: 'Ошибка удаления звезды из заявки' });
    }
  };

  const handleSaveComment = async (starId: number) => {
    if (!id) return;
    try {
      await dispatch(
        updateStarComment({
          selectedStarsId: Number(id),
          starId,
          comment: comments[starId] || '',
        })
      ).unwrap();
      await dispatch(getSelectedStarsById(Number(id)));
      setLocalMessage({ type: 'success', text: 'Комментарий сохранён' });
    } catch (err) {
      console.error('Ошибка сохранения комментария:', err);
      setLocalMessage({ type: 'error', text: 'Не удалось сохранить комментарий' });
    }
  };

  const handleCommentChange = (starId: number, comment: string) => {
    setComments(prev => ({ ...prev, [starId]: comment }));
  };

  if (loading) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', color: '#ff6b6b', padding: '20px' }}>{error}</div>
      </div>
    );
  }

  if (!selectedStars) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>Заявка не найдена</div>
      </div>
    );
  }

  const starsItems = selectedStarsData?.['selected-stars-items'] || selectedStarsData?.calculate_exoplanets || [];
  const stars: Star[] = starsItems.map((item: any) => {
    const starData = item.star || item;
    return {
      id: starData.id || starData.ID || 0,
      title: starData.title || '',
      description: starData.description || '',
      imagePath: starData.image_path?.replace(/^http:\/\/localhost:9000/, '/minio') || '',
      spectralType: starData.spectral_type || '',
      temperature: starData.temperature || '',
      radius: starData.radius || '',
      mass: starData.mass || '',
      luminosity: starData.luminosity || '',
      metallicity: starData.metallicity || '',
      age: starData.age || '',
      distance: starData.distance || '',
    };
  });

  const getStarCalculationData = (starId: number) => {
    const item = starsItems.find((item: any) => {
      const starData = item.star || item;
      const id = starData.id || starData.ID || 0;
      return id === starId;
    });
    if (!item) return { probableNumberOfPlanets: null, habitableZone: null };
    return {
      probableNumberOfPlanets: item.probable_number_of_planets ?? item.ProbableNumberOfPlanets ?? null,
      habitableZone: item.habitable_zone ?? item.HabitableZone ?? null,
    };
  };

  const statusLabels: { [key: string]: string } = {
    draft: 'Черновик',
    formed: 'Сформирован',
    completed: 'Завершен',
    declined: 'Отклонен',
  };

  return (
    <div className="main-content">
      <Breadcrumbs currentLabel={`Заявка #${selectedStarsData?.ID || id}`} />
      {localMessage && (
        <div
          style={{
            textAlign: 'center',
            color: localMessage.type === 'success' ? '#10b981' : localMessage.type === 'error' ? '#ff6b6b' : '#60a5fa',
            padding: '12px'
          }}
        >
          {localMessage.text}
        </div>
      )}
      
      <div className="selected-stars-header">
        <h2>Заявка #{selectedStarsData?.ID || id}</h2>
        <div className="selected-stars-status">
          Статус: <span className={`status-${selectedStarsData?.Status}`}>
            {statusLabels[selectedStarsData?.Status || ''] || selectedStarsData?.Status}
          </span>
        </div>
      </div>

      <div className="selected-stars-form">
        <div className="form-group">
          <label htmlFor="scientist_name">Имя ученого:</label>
          {isDraft ? (
            <input
              type="text"
              id="scientist_name"
              value={scientistName}
              onChange={(e) => setScientistName(e.target.value)}
              disabled={!isDraft}
            />
          ) : (
            <p>{scientistName || 'Не указано'}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="calculation_date">Дата расчета:</label>
          {isDraft ? (
            <input
              type="date"
              id="calculation_date"
              value={calculationDate}
              onChange={(e) => setCalculationDate(e.target.value)}
              disabled={!isDraft}
            />
          ) : (
            <p>{calculationDate || 'Не указано'}</p>
          )}
        </div>

        {isDraft && (
          <div className="form-actions">
            <button onClick={handleSave} className="btn btn-primary">
              Сохранить
            </button>
            <button onClick={handleForm} className="btn btn-success">
              Сформировать заявку
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Удалить заявку
            </button>
          </div>
        )}
      </div>

      <h3 style={{ color: '#ffffff', marginTop: '30px' }}>Звезды в заявке ({stars.length})</h3>
      
      {stars.length > 0 && (
        <div className="selected-stars-header-card">
          <div className="selected-stars-header-image">Изображение</div>
          <div className="selected-stars-header-title">Название</div>
          <div className="selected-stars-header-planets">Вероятное число планет</div>
          <div className="selected-stars-header-zone">Обитаемая зона</div>
          <div className="selected-stars-header-comment">Комментарий</div>
          <div></div>
          <div></div>
        </div>
      )}
      
      <div className="selected-stars-list">
        {stars.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#ffffff', padding: '20px' }}>
            В заявке нет звезд
          </div>
        ) : (
          stars.map((star) => {
            const calcData = getStarCalculationData(star.id);
            return (
              <div key={star.id} className="selected-stars-card">
                <div className="selected-stars-card-image">
                  <img 
                    src={star.imagePath || defaultStarImage} 
                    alt={star.title}
                  />
                </div>
                <div className="selected-stars-card-title">
                  <h3 className="selected-stars-title">{star.title}</h3>
                </div>
                <div className="selected-stars-card-planets">
                  <span className="selected-stars-info-value">
                    {calcData.probableNumberOfPlanets ?? '-'}
                  </span>
                </div>
                <div className="selected-stars-card-zone">
                  <span className="selected-stars-info-value">
                    {calcData.habitableZone || '-'}
                  </span>
                </div>
                <div className="selected-stars-card-comment">
                  <div className="selected-stars-comment-actions">
                    <input
                      type="text"
                      id={`selected-stars-comment-${star.id}`}
                      className="selected-stars-comment-input"
                      value={comments[star.id] ?? ''}
                      onChange={(e) => handleCommentChange(star.id, e.target.value)}
                      placeholder="Комментарий"
                      disabled={!isDraft && !isAstronomer}
                    />
                    {(isDraft || isAstronomer) && (
                      <button
                        onClick={() => handleSaveComment(star.id)}
                        className="btn btn-primary selected-stars-comment-save"
                      >
                        Сохранить
                      </button>
                    )}
                  </div>
                </div>
                <div></div>
                <div className="selected-stars-card-actions">
                  <div className="selected-stars-buttons">
                    <Link to={`/star/${star.id}`} className="selected-stars-details-button">
                      Подробнее
                    </Link>
                    {isDraft && (
                      <button
                        onClick={() => handleRemoveStar(star.id)}
                        className="selected-stars-remove-button"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

