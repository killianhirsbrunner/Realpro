import { forwardRef, type InputHTMLAttributes, useId, createContext, useContext } from 'react';
import clsx from 'clsx';

// ═══════════════════════════════════════════════════════════════════════════
// RADIO GROUP CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════════════
// RADIO GROUP
// ═══════════════════════════════════════════════════════════════════════════

export interface RadioGroupProps {
  /** Group name for all radios */
  name: string;
  /** Currently selected value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Group label */
  label?: string;
  /** Description */
  description?: string;
  /** Error message */
  error?: string;
  /** Disable all radios */
  disabled?: boolean;
  /** Size for all radios */
  size?: 'sm' | 'md' | 'lg';
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Children (Radio components) */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  label,
  description,
  error,
  disabled,
  size = 'md',
  direction = 'vertical',
  children,
  className,
}: RadioGroupProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, disabled, size }}>
      <fieldset
        className={clsx('border-0 p-0 m-0', className)}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={
          error ? errorId : description ? descriptionId : undefined
        }
      >
        {label && (
          <legend
            id={labelId}
            className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3"
          >
            {label}
          </legend>
        )}

        {description && (
          <p
            id={descriptionId}
            className="text-sm text-neutral-500 dark:text-neutral-400 mb-3"
          >
            {description}
          </p>
        )}

        <div
          className={clsx(
            'flex',
            direction === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4'
          )}
          role="radiogroup"
        >
          {children}
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-2 text-sm text-error-600 dark:text-error-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RADIO
// ═══════════════════════════════════════════════════════════════════════════

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Radio value */
  value: string;
  /** Radio label */
  label?: string;
  /** Description text */
  description?: string;
  /** Size variant (overrides group size) */
  size?: 'sm' | 'md' | 'lg';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ value, label, description, size: sizeProp, className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const radioId = id || generatedId;
    const groupContext = useContext(RadioGroupContext);

    const name = groupContext?.name || props.name;
    const isChecked = groupContext ? groupContext.value === value : props.checked;
    const isDisabled = disabled || groupContext?.disabled;
    const size = sizeProp || groupContext?.size || 'md';

    const handleChange = () => {
      groupContext?.onChange?.(value);
    };

    const sizeStyles = {
      sm: {
        radio: 'h-4 w-4',
        dot: 'h-1.5 w-1.5',
        label: 'text-sm',
        description: 'text-xs',
      },
      md: {
        radio: 'h-5 w-5',
        dot: 'h-2 w-2',
        label: 'text-sm',
        description: 'text-xs',
      },
      lg: {
        radio: 'h-6 w-6',
        dot: 'h-2.5 w-2.5',
        label: 'text-base',
        description: 'text-sm',
      },
    };

    const styles = sizeStyles[size];

    return (
      <div className={clsx('relative flex items-start', className)}>
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              ref={ref}
              id={radioId}
              type="radio"
              name={name}
              value={value}
              checked={isChecked}
              disabled={isDisabled}
              onChange={handleChange}
              className={clsx(
                'peer appearance-none',
                styles.radio,
                'rounded-full border-2 transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
                'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900',
                'checked:border-brand-400',
                'hover:border-neutral-400 checked:hover:border-brand-500',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
              {...props}
            />
            <div
              className={clsx(
                'absolute inset-0 flex items-center justify-center pointer-events-none',
                'opacity-0 peer-checked:opacity-100 transition-opacity duration-150'
              )}
            >
              <div className={clsx(styles.dot, 'rounded-full bg-brand-400')} />
            </div>
          </div>
        </div>

        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={radioId}
                className={clsx(
                  'font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer',
                  styles.label,
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={clsx(
                  'text-neutral-500 dark:text-neutral-400 mt-0.5',
                  styles.description
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
