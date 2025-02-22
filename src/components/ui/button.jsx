import React from 'react';
import clsx from 'clsx';

export const Button = ({ className, children, variant = 'default', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium focus:outline-none transition';
  const variants = {
    default: 'bg-emerald-500 text-white hover:bg-emerald-600',
    outline: 'border border-emerald-500 text-emerald-500 hover:bg-emerald-50',
  };

  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};
