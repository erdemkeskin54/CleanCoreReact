import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@shared/lib/cn';

// Tipik içerik bölmesi — bordered, white background, soft shadow.
export const Card = ({
  className,
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={cn('rounded-lg border border-slate-200 bg-white p-6 shadow-sm', className)}
    {...rest}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children }: PropsWithChildren<{ className?: string }>) => (
  <div className={cn('mb-4 flex flex-col gap-1', className)}>{children}</div>
);

export const CardTitle = ({ className, children }: PropsWithChildren<{ className?: string }>) => (
  <h2 className={cn('text-xl font-semibold text-slate-900', className)}>{children}</h2>
);

export const CardDescription = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <p className={cn('text-sm text-slate-500', className)}>{children}</p>
);
