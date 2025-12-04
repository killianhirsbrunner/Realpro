import { useState } from 'react';
import { Plus } from 'lucide-react';

interface KanbanColumn {
  id: string;
  title: string;
  items: any[];
  color?: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  renderCard: (item: any) => React.ReactNode;
  onCardClick?: (item: any) => void;
  onAddItem?: (columnId: string) => void;
  onMoveItem?: (itemId: string, fromColumn: string, toColumn: string) => void;
}

export function KanbanBoard({
  columns,
  renderCard,
  onCardClick,
  onAddItem,
  onMoveItem,
}: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);

  const handleDragStart = (item: any, columnId: string) => {
    setDraggedItem(item);
    setDraggedFromColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (draggedItem && draggedFromColumn && draggedFromColumn !== columnId) {
      onMoveItem?.(draggedItem.id, draggedFromColumn, columnId);
    }
    setDraggedItem(null);
    setDraggedFromColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl p-4 min-h-[600px]"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                {column.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {column.items.length} {column.items.length > 1 ? 'éléments' : 'élément'}
              </p>
            </div>
            {onAddItem && (
              <button
                onClick={() => onAddItem(column.id)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <Plus className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {column.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item, column.id)}
                onClick={() => onCardClick?.(item)}
                className="cursor-move hover:scale-[1.02] transition-transform"
              >
                {renderCard(item)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
