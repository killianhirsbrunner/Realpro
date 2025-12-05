import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../../lib/design-system/tokens';

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  variant?: 'numbered' | 'icons';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  variant = 'numbered',
  orientation = 'horizontal',
  className = '',
}: StepperProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (orientation === 'vertical') {
    return (
      <VerticalStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepClick}
        variant={variant}
        className={className}
        isDark={isDark}
      />
    );
  }

  return (
    <HorizontalStepper
      steps={steps}
      currentStep={currentStep}
      onStepClick={onStepClick}
      variant={variant}
      className={className}
      isDark={isDark}
    />
  );
}

function HorizontalStepper({
  steps,
  currentStep,
  onStepClick,
  variant,
  className,
  isDark,
}: StepperProps & { isDark: boolean }) {
  const brandColor = isDark ? designTokens.colors.dark.brand : designTokens.colors.light.brand;
  const borderColor = isDark ? designTokens.colors.dark.border : designTokens.colors.light.border;
  const successColor = isDark ? designTokens.colors.dark.success : designTokens.colors.light.success;

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || index <= currentStep + 1);

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: isCompleted
                    ? successColor
                    : isCurrent
                    ? brandColor
                    : isDark
                    ? designTokens.colors.dark.secondary
                    : designTokens.colors.light.secondary,
                  color: isCompleted || isCurrent ? '#ffffff' : isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent,
                  border: isCurrent ? `2px solid ${brandColor}` : 'none',
                }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : variant === 'icons' && step.icon ? (
                  step.icon
                ) : (
                  index + 1
                )}
              </button>

              <div className="mt-2 text-center max-w-24">
                <p
                  className={`text-xs font-medium ${isCurrent ? 'font-semibold' : ''}`}
                  style={{
                    color: isCurrent
                      ? brandColor
                      : isDark
                      ? designTokens.colors.dark.foreground
                      : designTokens.colors.light.foreground,
                  }}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2"
                style={{
                  backgroundColor: index < currentStep ? successColor : borderColor,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function VerticalStepper({
  steps,
  currentStep,
  onStepClick,
  variant,
  className,
  isDark,
}: StepperProps & { isDark: boolean }) {
  const brandColor = isDark ? designTokens.colors.dark.brand : designTokens.colors.light.brand;
  const borderColor = isDark ? designTokens.colors.dark.border : designTokens.colors.light.border;
  const successColor = isDark ? designTokens.colors.dark.success : designTokens.colors.light.success;

  return (
    <div className={className}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || index <= currentStep + 1);

        return (
          <div key={step.id} className="flex gap-4 pb-8 last:pb-0 relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className="absolute left-5 top-12 bottom-0 w-0.5"
                style={{
                  backgroundColor: index < currentStep ? successColor : borderColor,
                }}
              />
            )}

            {/* Step icon */}
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all flex-shrink-0 ${
                isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
              }`}
              style={{
                backgroundColor: isCompleted
                  ? successColor
                  : isCurrent
                  ? brandColor
                  : isDark
                  ? designTokens.colors.dark.secondary
                  : designTokens.colors.light.secondary,
                color: isCompleted || isCurrent ? '#ffffff' : isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent,
                border: isCurrent ? `2px solid ${brandColor}` : 'none',
              }}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : variant === 'icons' && step.icon ? (
                step.icon
              ) : (
                index + 1
              )}
            </button>

            {/* Step content */}
            <div className="flex-1 pt-1">
              <h4
                className={`text-sm font-medium mb-1 ${isCurrent ? 'font-semibold' : ''}`}
                style={{
                  color: isCurrent
                    ? brandColor
                    : isDark
                    ? designTokens.colors.dark.foreground
                    : designTokens.colors.light.foreground,
                }}
              >
                {step.label}
              </h4>
              {step.description && (
                <p
                  className="text-xs"
                  style={{ color: isDark ? designTokens.colors.dark.accent : designTokens.colors.light.accent }}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
