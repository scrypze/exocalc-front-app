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
      
      let label = segment;
      
      if (segment === 'stars') {
        label = 'Звёзды';
      } else if (segment === 'star' && pathSegments[index + 1]) {
        breadcrumbs.push({
          path: '/stars',
          label: 'Звёзды',
        });
        label = currentLabel || `Звезда ${pathSegments[index + 1]}`;
        breadcrumbs.push({
          path: currentPath,
          label: label,
        });
        return;
      } else if (segment === 'application' && pathSegments[index + 1]) {
        breadcrumbs.push({
          path: '/applications',
          label: 'Заявки',
        });
        label = currentLabel || `Заявка #${pathSegments[index + 1]}`;
        breadcrumbs.push({
          path: currentPath,
          label: label,
        });
        return;
      } else if (segment === 'applications') {
        label = 'Заявки';
      } else if (!isNaN(Number(segment))) {
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
