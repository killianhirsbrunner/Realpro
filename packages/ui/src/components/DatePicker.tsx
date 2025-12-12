import { forwardRef, useState, useCallback, useId, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DatePickerProps {
  /** Label text */
  label?: string;
  /** Description/hint text */
  hint?: string;
  /** Error message */
  error?: string;
  /** Selected date */
  value?: Date | null;
  /** Callback when date changes */
  onChange?: (date: Date | null) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Date format for display */
  displayFormat?: (date: Date) => string;
  /** Disabled state */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

const WEEKDAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function defaultFormat(date: Date): string {
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday=0 to Monday=0
  return day === 0 ? 6 : day - 1;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      hint,
      error,
      value,
      onChange,
      placeholder = 'Sélectionner une date',
      minDate,
      maxDate,
      displayFormat = defaultFormat,
      disabled = false,
      required = false,
      size = 'md',
      className,
    },
    ref
  ) => {
    const id = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => value || new Date());

    const sizeStyles = {
      sm: {
        input: 'py-1.5 px-3 text-sm',
        calendar: 'p-3',
        dayButton: 'h-7 w-7 text-xs',
        icon: 'h-4 w-4',
      },
      md: {
        input: 'py-2 px-3 text-sm',
        calendar: 'p-4',
        dayButton: 'h-8 w-8 text-sm',
        icon: 'h-5 w-5',
      },
      lg: {
        input: 'py-2.5 px-4 text-base',
        calendar: 'p-5',
        dayButton: 'h-9 w-9 text-sm',
        icon: 'h-5 w-5',
      },
    };

    const styles = sizeStyles[size];

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen]);

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = useCallback(() => {
      setViewDate(new Date(currentYear, currentMonth - 1, 1));
    }, [currentYear, currentMonth]);

    const handleNextMonth = useCallback(() => {
      setViewDate(new Date(currentYear, currentMonth + 1, 1));
    }, [currentYear, currentMonth]);

    const handleSelectDate = useCallback(
      (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        onChange?.(newDate);
        setIsOpen(false);
      },
      [currentYear, currentMonth, onChange]
    );

    const isDateDisabled = useCallback(
      (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
      },
      [currentYear, currentMonth, minDate, maxDate]
    );

    const today = new Date();

    // Build calendar grid
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div ref={containerRef} className={clsx('relative', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
            {required && <span className="text-error-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Input */}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="text"
            readOnly
            value={value ? displayFormat(value) : ''}
            placeholder={placeholder}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={clsx(
              'block w-full rounded-lg border bg-white dark:bg-neutral-900',
              'text-neutral-900 dark:text-neutral-100',
              'placeholder-neutral-400 dark:placeholder-neutral-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors cursor-pointer',
              styles.input,
              'pr-10',
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                : 'border-neutral-300 dark:border-neutral-700 focus:border-brand-400 focus:ring-brand-400/20',
              disabled && 'bg-neutral-50 dark:bg-neutral-800 cursor-not-allowed opacity-60'
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Calendar className={clsx(styles.icon, 'text-neutral-400')} />
          </div>
        </div>

        {/* Hint/Error */}
        {(error || hint) && (
          <p
            id={error ? `${id}-error` : `${id}-hint`}
            className={clsx(
              'mt-1.5 text-sm',
              error ? 'text-error-600 dark:text-error-400' : 'text-neutral-500 dark:text-neutral-400'
            )}
          >
            {error || hint}
          </p>
        )}

        {/* Calendar dropdown */}
        {isOpen && (
          <div
            className={clsx(
              'absolute z-50 mt-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg',
              styles.calendar
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Calendrier"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Mois précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Mois suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-xs font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className={styles.dayButton} />;
                }

                const date = new Date(currentYear, currentMonth, day);
                const isSelected = value && isSameDay(date, value);
                const isToday = isSameDay(date, today);
                const isDisabled = isDateDisabled(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => !isDisabled && handleSelectDate(day)}
                    disabled={isDisabled}
                    className={clsx(
                      styles.dayButton,
                      'rounded-lg font-medium transition-colors',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                      isSelected
                        ? 'bg-brand-400 text-white hover:bg-brand-500'
                        : isToday
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 hover:bg-brand-100'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      isDisabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Today button */}
            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setViewDate(today);
                  onChange?.(today);
                  setIsOpen(false);
                }}
                className="w-full py-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors"
              >
                Aujourd'hui
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
