import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('mb-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={clsx('text-lg font-semibold text-gray-900 dark:text-white', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={clsx('text-sm text-gray-500 dark:text-neutral-400', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('text-gray-600 dark:text-neutral-400', className)} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

const CardBase = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm',
          {
            'hover:shadow-md transition-shadow duration-200': hover,
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardBase.displayName = 'Card';

// Create a compound component with subcomponents attached as static properties
export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

// Also export individual components for direct imports
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
