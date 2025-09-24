export function Spinner({ id }: { id?: string }) {
  return (
    <div id={id} className="spinner" aria-label="loading">
      <div className="spinner-dot" />
      <div className="spinner-dot" />
      <div className="spinner-dot" />
    </div>
  );
}


