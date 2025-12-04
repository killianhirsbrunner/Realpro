import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface RealProTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function RealProTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick
}: RealProTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-sm text-neutral-500 dark:text-neutral-400">
            {columns.map((col) => (
              <th key={String(col.key)} className="pb-3 px-4 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`
                bg-white
                dark:bg-neutral-900
                border
                border-neutral-200
                dark:border-neutral-800
                rounded-xl
                shadow-soft
                hover:shadow-card
                transition-all
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="py-4 px-4 first:rounded-l-xl last:rounded-r-xl"
                >
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] || '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          Aucune donnée disponible
        </div>
      )}
    </div>
  );
}
