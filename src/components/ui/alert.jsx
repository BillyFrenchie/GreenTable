import React from 'react';
import clsx from 'clsx';

export const Alert = ({ className, children, ...props }) => (
  <div className={clsx('bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-lg', className)} {...props}>
    {children}
  </div>
);
