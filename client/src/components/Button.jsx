import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  to,
  onClick,
  variant = 'primary', // 'primary' | 'outline' | 'gold'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  className = '',
  icon,
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-8 py-3.5 text-xs',
    lg: 'px-10 py-4 text-sm',
  };

  const variantClasses = {
    primary: 'bg-lumiere-deep text-lumiere-bg border border-lumiere-deep hover:bg-lumiere-gold-hover hover:border-lumiere-gold-hover hover:text-white',
    outline: 'bg-transparent text-lumiere-charcoal border border-lumiere-charcoal hover:bg-lumiere-charcoal hover:text-white',
    gold: 'bg-lumiere-gold text-white border border-lumiere-gold hover:bg-lumiere-gold-hover',
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        <span>{children}</span>
        {icon}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      <span>{children}</span>
      {icon}
    </button>
  );
};

export default Button;
