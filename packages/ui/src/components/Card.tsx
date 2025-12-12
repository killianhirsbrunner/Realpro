import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'rounded-xl';

    const variantStyles = {
      default: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800',
      elevated: 'bg-white dark:bg-neutral-900 shadow-lg',
      outlined: 'bg-transparent border border-neutral-200 dark:border-neutral-700',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('flex items-start justify-between gap-4 mb-4', className)}
        {...props}
      >
        {children || (
          <>
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-3',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
