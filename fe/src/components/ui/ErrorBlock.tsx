interface ErrorBlockProps {
  id?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorBlock({ id, title = '오류가 발생했습니다', message = '잠시 후 다시 시도해 주세요.', onRetry }: ErrorBlockProps) {
  return (
    <div id={id} className="error-block" role="alert">
      <div className="error-title">{title}</div>
      <div className="error-message">{message}</div>
      {onRetry && (
        <button className="btn btn--secondary btn--s" onClick={onRetry} id={`${id ? id + '-' : ''}retry-btn`}>
          다시 시도
        </button>
      )}
    </div>
  );
}


