import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export interface StepperStep {
  /** Step label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional icon (replaces number) */
  icon?: ReactNode;
  /** Whether step is optional */
  optional?: boolean;
}

export interface StepperProps {
  /** Steps configuration */
  steps: StepperStep[];
  /** Current active step (0-indexed) */
  activeStep: number;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Callback when step is clicked */
  onStepClick?: (stepIndex: number) => void;
  /** Allow clicking only completed steps */
  clickableCompleted?: boolean;
  /** Additional classes */
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  orientation = 'horizontal',
  size = 'md',
  onStepClick,
  clickableCompleted = true,
  className,
}: StepperProps) {
  const sizeStyles = {
    sm: {
      indicator: 'h-6 w-6 text-xs',
      icon: 'h-3 w-3',
      label: 'text-xs',
      description: 'text-xs',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    },
    md: {
      indicator: 'h-8 w-8 text-sm',
      icon: 'h-4 w-4',
      label: 'text-sm',
      description: 'text-xs',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    },
    lg: {
      indicator: 'h-10 w-10 text-base',
      icon: 'h-5 w-5',
      label: 'text-base',
      description: 'text-sm',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    },
  };

  const styles = sizeStyles[size];

  const getStepStatus = (index: number) => {
    if (index < activeStep) return 'completed';
    if (index === activeStep) return 'active';
    return 'pending';
  };

  const handleStepClick = (index: number) => {
    if (!onStepClick) return;

    const status = getStepStatus(index);
    if (clickableCompleted && status === 'completed') {
      onStepClick(index);
    } else if (!clickableCompleted) {
      onStepClick(index);
    }
  };

  const isHorizontal = orientation === 'horizontal';

  return (
    <nav aria-label="Progress" className={className}>
      <ol
        className={clsx(
          'flex',
          isHorizontal
            ? 'flex-row items-start'
            : 'flex-col'
        )}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable =
            onStepClick &&
            (clickableCompleted ? status === 'completed' : true);
          const isLast = index === steps.length - 1;

          return (
            <li
              key={index}
              className={clsx(
                'flex',
                isHorizontal
                  ? 'flex-1 items-start'
                  : 'relative pb-8 last:pb-0'
              )}
            >
              {/* Step content */}
              <div
                className={clsx(
                  'flex',
                  isHorizontal
                    ? 'flex-col items-center'
                    : 'items-start gap-4'
                )}
              >
                {/* Indicator */}
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={clsx(
                    styles.indicator,
                    'relative flex items-center justify-center rounded-full font-medium',
                    'transition-all duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
                    {
                      'bg-brand-400 text-white': status === 'completed',
                      'border-2 border-brand-400 bg-white text-brand-400 dark:bg-neutral-900':
                        status === 'active',
                      'border-2 border-neutral-300 bg-white text-neutral-400 dark:border-neutral-600 dark:bg-neutral-900':
                        status === 'pending',
                      'cursor-pointer hover:ring-2 hover:ring-brand-200': isClickable,
                      'cursor-default': !isClickable,
                    }
                  )}
                  aria-current={status === 'active' ? 'step' : undefined}
                >
                  {status === 'completed' ? (
                    <Check className={styles.icon} />
                  ) : step.icon ? (
                    <span className={styles.icon}>{step.icon}</span>
                  ) : (
                    index + 1
                  )}
                </button>

                {/* Label & description */}
                <div
                  className={clsx(
                    isHorizontal
                      ? 'mt-2 text-center'
                      : 'min-w-0 flex-1'
                  )}
                >
                  <p
                    className={clsx(
                      styles.label,
                      'font-medium',
                      status === 'active'
                        ? 'text-brand-600 dark:text-brand-400'
                        : status === 'completed'
                        ? 'text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-500 dark:text-neutral-400'
                    )}
                  >
                    {step.label}
                    {step.optional && (
                      <span className="font-normal text-neutral-400 dark:text-neutral-500 ml-1">
                        (optionnel)
                      </span>
                    )}
                  </p>
                  {step.description && (
                    <p
                      className={clsx(
                        styles.description,
                        'text-neutral-500 dark:text-neutral-400 mt-0.5',
                        isHorizontal && 'max-w-[120px]'
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div
                  className={clsx(
                    isHorizontal
                      ? 'flex-1 mx-2 self-center mt-4'
                      : 'absolute left-4 top-8 bottom-0 ml-px',
                    styles.connector,
                    status === 'completed'
                      ? 'bg-brand-400'
                      : 'bg-neutral-200 dark:bg-neutral-700'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
