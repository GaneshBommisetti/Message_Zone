import { ReactNode } from 'react';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 shadow-sm data-table-scroll max-w-xs sm:max-w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
      <table className="w-full table-auto border-collapse">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-slate-700 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-slate-500 text-sm"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-slate-900"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
