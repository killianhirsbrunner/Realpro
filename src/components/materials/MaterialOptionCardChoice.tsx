import { Check } from 'lucide-react';
import { RealProCard } from '../realpro/RealProCard';
import { RealProBadge } from '../realpro/RealProBadge';

interface MaterialOption {
  id: string;
  label: string;
  description?: string;
  price: number;
  is_standard: boolean;
  images?: string[];
}

interface MaterialOptionCardChoiceProps {
  option: MaterialOption;
  isSelected: boolean;
  onToggle: () => void;
}

export function MaterialOptionCardChoice({ option, isSelected, onToggle }: MaterialOptionCardChoiceProps) {
  return (
    <RealProCard
      className={`cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-blue-600 dark:ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
          : 'hover:shadow-card'
      }`}
      onClick={onToggle}
    >
      <div className="relative">
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
        )}

        {option.is_standard && (
          <div className="mb-3">
            <RealProBadge variant="success">Standard inclus</RealProBadge>
          </div>
        )}

        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          {option.label}
        </h3>

        {option.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            {option.description}
          </p>
        )}

        {option.price > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-500">
              + CHF {option.price.toLocaleString('fr-CH')}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              Surcoût par rapport au standard
            </p>
          </div>
        )}

        {option.price === 0 && !option.is_standard && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Sans surcoût
            </p>
          </div>
        )}
      </div>
    </RealProCard>
  );
}
