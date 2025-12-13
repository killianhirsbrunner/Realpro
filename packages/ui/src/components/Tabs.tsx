import { type ReactNode, useState } from 'react';
import clsx from 'clsx';

export interface TabsProps {
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Change handler (alias: onValueChange) */
  onChange?: (value: string) => void;
  /** Change handler (alternative API) */
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, defaultValue, onChange, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={clsx('w-full', className)}>
      <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
        {children}
      </TabsContext.Provider>
    </div>
  );
}

// Tabs List
export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={clsx(
        'flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

// Tab Trigger
export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({ value, children, disabled, className }: TabsTriggerProps) {
  const context = useTabsContext();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => context.onChange(value)}
      className={clsx(
        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
        context.value === value
          ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

// Tab Content
export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useTabsContext();

  if (context.value !== value) return null;

  return <div className={clsx('mt-4', className)}>{children}</div>;
}

// Context
import { createContext, useContext } from 'react';

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Attach subcomponents
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
