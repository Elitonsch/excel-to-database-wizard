
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ColumnSelectorProps {
  columns: string[];
  selectedColumns: string[];
  onColumnToggle: (column: string) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumns,
  onColumnToggle,
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-4">Selecione as Colunas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column} className="flex items-center space-x-2">
            <Checkbox
              id={column}
              checked={selectedColumns.includes(column)}
              onCheckedChange={() => onColumnToggle(column)}
            />
            <label
              htmlFor={column}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {column}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;
