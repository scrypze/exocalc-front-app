import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

interface BreadcrumbItem {
  path: string;
  label: string;
}

interface BreadcrumbsProps {
  currentLabel?: string;
}

export const Breadcrumbs = ({ currentLabel }: BreadcrumbsProps) => {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ path: '/', label: 'Главная' }];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Определяем название для каждого сегмента
      let label = segment;
      
      if (segment === 'stars') {
        label = 'Каталог звёзд';
      } else if (segment === 'star' && pathSegments[index + 1]) {
        // Страница деталей звезды находится внутри каталога
        // Добавляем промежуточный breadcrumb для каталога
        breadcrumbs.push({
          path: '/stars',
          label: 'Каталог звёзд',
        });
        // Для страницы деталей звезды используем переданное название или ID
        label = currentLabel || `Звезда ${pathSegments[index + 1]}`;
        // Добавляем breadcrumb для страницы деталей
        breadcrumbs.push({
          path: currentPath,
          label: label,
        });
        // Пропускаем следующий сегмент (ID), так как мы его уже обработали
        return;
      } else if (!isNaN(Number(segment))) {
        // Если это число (ID), пропускаем - уже обработано выше
        return;
      }
      
      breadcrumbs.push({
        path: currentPath,
        label: label,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  
  // Если только главная страница, не показываем breadcrumbs
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Навигационная цепочка">
      <ol className="breadcrumbs-list">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.path} className="breadcrumbs-item">
              {isLast ? (
                <span className="breadcrumbs-current">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="breadcrumbs-link">
                  {crumb.label}
                </Link>
              )}
              {!isLast && <span className="breadcrumbs-separator"> / </span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
