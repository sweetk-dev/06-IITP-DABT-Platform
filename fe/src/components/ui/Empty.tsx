interface EmptyProps {
  id?: string;
  title?: string;
  description?: string;
}

export function Empty({ id, title = '내용이 없습니다', description = '조건을 변경하거나 다시 시도해 주세요.' }: EmptyProps) {
  return (
    <div id={id} className="empty">
      <div className="empty-title">{title}</div>
      <div className="empty-desc">{description}</div>
    </div>
  );
}


