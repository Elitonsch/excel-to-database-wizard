
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ColumnSelector from '@/components/ColumnSelector';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleFileLoaded = (jsonData: any[], headers: string[]) => {
    setData(jsonData);
    setColumns(headers);
    setSelectedColumns([]); // Reset selected columns when new file is loaded
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleImport = () => {
    // Aqui você irá adicionar a lógica de inserção no banco de dados
    console.log('Dados selecionados:', {
      columns: selectedColumns,
      data: data.map(row => 
        Object.fromEntries(
          selectedColumns.map(col => [col, row[col]])
        )
      )
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Importador de Planilhas</h1>
      
      {!data.length ? (
        <FileUpload onFileLoaded={handleFileLoaded} />
      ) : (
        <div className="space-y-6">
          <ColumnSelector
            columns={columns}
            selectedColumns={selectedColumns}
            onColumnToggle={handleColumnToggle}
          />
          
          <div className="flex justify-end">
            <Button
              onClick={handleImport}
              disabled={selectedColumns.length === 0}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              Importar Dados
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
