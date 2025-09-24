import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  id?: string;
  title: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function SectionHeader({ id, title, actionText, actionHref, onAction }: SectionHeaderProps) {
  return (
    <div id={id} className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0 12px' }}>
      <h3 className="section-title" style={{ margin: 0 }}>{title}</h3>
      {actionText && (
        actionHref ? (
          <Link to={actionHref}>
            <button id={`${id ? id + '-' : ''}action`} className="btn btn--secondary btn--s">
              {actionText}
            </button>
          </Link>
        ) : (
          <button id={`${id ? id + '-' : ''}action`} className="btn btn--secondary btn--s" onClick={onAction}>
            {actionText}
          </button>
        )
      )}
    </div>
  );
}


