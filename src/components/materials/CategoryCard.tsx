import { Card } from '../ui/Card';
import { ChevronRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string | null;
    optionCount?: number;
  };
  projectId: string;
}

export function CategoryCard({ category, projectId }: CategoryCardProps) {
  return (
    <Link to={`/projects/${projectId}/materials/catalog?category=${category.id}`}>
      <Card className="p-6 hover:shadow-lg transition cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-100 rounded-lg">
                <Package className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>

            {category.description && (
              <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                {category.description}
              </p>
            )}

            {category.optionCount !== undefined && (
              <p className="text-sm text-neutral-500 mt-3">
                {category.optionCount} option{category.optionCount > 1 ? 's' : ''} disponible{category.optionCount > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-600 transition flex-shrink-0 mt-1" />
        </div>
      </Card>
    </Link>
  );
}
