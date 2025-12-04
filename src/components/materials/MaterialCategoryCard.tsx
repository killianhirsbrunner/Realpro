import { useState } from 'react';
import { RealProCard } from '../realpro/RealProCard';
import { ChevronRight } from 'lucide-react';

interface MaterialCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

interface MaterialCategoryCardProps {
  category: MaterialCategory;
  optionsCount: number;
  onClick: () => void;
}

export function MaterialCategoryCard({ category, optionsCount, onClick }: MaterialCategoryCardProps) {
  return (
    <RealProCard
      className="cursor-pointer hover:shadow-card transition-all group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              {category.description}
            </p>
          )}
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            {optionsCount} option{optionsCount > 1 ? 's' : ''} disponible{optionsCount > 1 ? 's' : ''}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
      </div>
    </RealProCard>
  );
}
