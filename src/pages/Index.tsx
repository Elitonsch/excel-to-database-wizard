
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ColumnSelector from '@/components/ColumnSelector';
import { Button } from '@/components/ui/button';
import { Database, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const { toast } = useToast();

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

  const handleImport = async () => {
    try {
      // Preparar os dados para inserção no PostgreSQL
      const filteredData = data.map(row => 
        Object.fromEntries(
          selectedColumns.map(col => [col, row[col]])
        )
      );
      
      // Aqui você deverá implementar a conexão com o PostgreSQL
      // Exemplo de como seria a implementação:
      /*
      // Usando uma API REST:
      const response = await fetch('/api/importData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tableName: 'sua_tabela',  // Nome da tabela no PostgreSQL
          columns: selectedColumns, 
          data: filteredData 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao inserir dados no banco de dados');
      }
      
      const result = await response.json();
      */
      
      // Como demonstração, apenas mostrar no console
      console.log('Dados prontos para serem inseridos no PostgreSQL:', {
        columns: selectedColumns,
        data: filteredData,
      });
      
      toast({
        title: "Sucesso",
        description: `${filteredData.length} registros prontos para inserção no PostgreSQL. Veja o console para detalhes.`,
      });
      
      // Resetar o estado após a importação bem-sucedida
      setData([]);
      setColumns([]);
      setSelectedColumns([]);
    } catch (error) {
      console.error('Erro durante a importação:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante a importação dos dados.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setData([]);
    setColumns([]);
    setSelectedColumns([]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Importador de Planilhas</h1>
      
      {!data.length ? (
        <FileUpload onFileLoaded={handleFileLoaded} />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Dados Carregados</h2>
            <Button variant="ghost" onClick={handleReset} className="gap-2">
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
          
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
