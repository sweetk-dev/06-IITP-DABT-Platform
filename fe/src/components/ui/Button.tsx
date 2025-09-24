import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 's' | 'm' | 'l';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({ id, children, variant = 'primary', size = 'm', fullWidth, loading, disabled, ...rest }: ButtonProps) {
  const base = 'btn';
  const cls = [base, `${base}--${variant}`, `${base}--${size}`, fullWidth ? `${base}--block` : '']
    .filter(Boolean)
    .join(' ');
  return (
    <button id={id} className={cls} disabled={disabled || loading} {...rest}>
      {loading ? 'Loading...' : children}
    </button>
  );
}
