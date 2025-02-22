import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';

export const Card = ({ className, children, ...props }) => (
  <div className={clsx('rounded-2xl shadow-md bg-white p-4', className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div className={clsx('border-b p-4 font-bold text-lg', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h2 className={clsx('text-xl font-semibold', className)} {...props}>
    {children}
  </h2>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={clsx('p-4', className)} {...props}>
    {children}
  </div>
);
