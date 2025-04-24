
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Database, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definindo o tipo para os campos do banco de dados
interface DatabaseSchema {
  id_user: string;
  codigo: string;
  areia: number;
  silte: number;
  argila: number;
  zinco: number;
  manganes: number;
  ferro: number;
  cobre: number;
  boro: number;
  saturacaoAluminio: number;
  saturacaoBases: number;
  ctcph: number;
  ctcEfetiva: number;
  somaBases: number;
  materiaOrganica: number;
  hidrogenioAluminio: number;
  aluminio: number;
  magnesio: number;
  calcio: number;
  enxofre: number;
  potassio: number;
  fosforoMehlich: number;
  phCacl: number;
  necessidadeCalagemTalhao: number;
  necessidadeCalagemHa: number;
  cultura: string;
  classificacaoTextural: string;
  delete: number;
  data: string;
  talhao: string;
}

// Criar um array com os nomes dos campos para facilitar o mapeamento
const dbFields = [
  'id_user',
  'codigo',
  'areia',
  'silte',
  'argila',
  'zinco',
  'manganes',
  'ferro',
  'cobre',
  'boro',
  'saturacaoAluminio',
  'saturacaoBases',
  'ctcph',
  'ctcEfetiva',
  'somaBases',
  'materiaOrganica',
  'hidrogenioAluminio',
  'aluminio',
  'magnesio',
  'calcio',
  'enxofre',
  'potassio',
  'fosforoMehlich',
  'phCacl',
  'necessidadeCalagemTalhao',
  'necessidadeCalagemHa',
  'cultura',
  'classificacaoTextural',
  'delete',
  'data',
  'talhao',
];

type FieldType = 'string' | 'number' | 'date';

// Mapeamento dos tipos de cada campo
const fieldTypes: Record<string, FieldType> = {
  id_user: 'string',
  codigo: 'string',
  areia: 'number',
  silte: 'number',
  argila: 'number',
  zinco: 'number',
  manganes: 'number',
  ferro: 'number',
  cobre: 'number',
  boro: 'number',
  saturacaoAluminio: 'number',
  saturacaoBases: 'number',
  ctcph: 'number',
  ctcEfetiva: 'number',
  somaBases: 'number',
  materiaOrganica: 'number',
  hidrogenioAluminio: 'number',
  aluminio: 'number',
  magnesio: 'number',
  calcio: 'number',
  enxofre: 'number',
  potassio: 'number',
  fosforoMehlich: 'number',
  phCacl: 'number',
  necessidadeCalagemTalhao: 'number',
  necessidadeCalagemHa: 'number',
  cultura: 'string',
  classificacaoTextural: 'string',
  delete: 'number',
  data: 'date',
  talhao: 'string',
};

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleFileLoaded = (jsonData: any[], headers: string[]) => {
    setData(jsonData);
    setColumns(headers);
    setColumnMapping({});
  };

  const handleColumnMappingChange = (dbField: string, excelColumn: string) => {
    setColumnMapping({
      ...columnMapping,
      [dbField]: excelColumn,
    });
  };

  const areAllFieldsMapped = () => {
    return dbFields.every(field => columnMapping[field] && columnMapping[field] !== 'none');
  };

  const generateInsertQueries = () => {
    const queries: string[] = [];
    
    data.forEach(row => {
      const mappedValues: Record<string, any> = {};
      
      Object.entries(columnMapping).forEach(([dbField, excelColumn]) => {
        if (excelColumn && row[excelColumn] !== undefined) {
          mappedValues[dbField] = row[excelColumn];
        }
      });
      
      const fields = Object.keys(mappedValues);
      const values = fields.map(field => {
        const value = mappedValues[field];
        if (fieldTypes[field] === 'string' || fieldTypes[field] === 'date') {
          return `'${value}'`;
        }
        return value;
      });
      
      const query = `INSERT INTO your_table_name (${fields.join(', ')}) VALUES (${values.join(', ')});`;
      queries.push(query);
    });
    
    return queries;
  };

  const handleImport = () => {
    try {
      if (!areAllFieldsMapped()) {
        toast({
          title: "Erro",
          description: "Por favor, mapeie todos os campos antes de prosseguir.",
          variant: "destructive",
        });
        return;
      }

      const insertQueries = generateInsertQueries();
      console.log('Queries SQL geradas:', insertQueries.join('\n'));
      
      toast({
        title: "Sucesso",
        description: `${data.length} registros processados. Verifique o console para ver as queries SQL.`,
      });
      
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
    setColumnMapping({});
  };

  const getMappedFieldsCount = () => {
    return Object.keys(columnMapping).filter(key => columnMapping[key] && columnMapping[key] !== 'none').length;
  };

  const getFieldOptions = (field: string) => {
    if (field === 'id_user') {
      return ['JNA', 'CNP'];
    }
    if (field === 'delete') {
      return [0];
    }
    return columns;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Importador de Planilhas</h1>
      
      {!data.length ? (
        <FileUpload onFileLoaded={handleFileLoaded} />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Mapear Colunas</h2>
            <Button variant="ghost" onClick={handleReset} className="gap-2">
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
          
          <div className="bg-white p-4 border rounded-lg">
            <p className="mb-4 text-sm text-gray-600">
              Selecione a coluna da planilha que corresponde a cada campo do banco de dados. 
              Você mapeou {getMappedFieldsCount()} de {dbFields.length} campos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbFields.map((field) => (
                <div key={field} className="space-y-1">
                  <label htmlFor={`field-${field}`} className="text-sm font-medium">
                    {field}
                    <span className="text-xs text-gray-500 ml-1">
                      ({fieldTypes[field]})
                    </span>
                  </label>
                  <Select
                    value={columnMapping[field] || "none"}
                    onValueChange={(value) => handleColumnMappingChange(field, value === "none" ? "" : value)}
                  >
                    <SelectTrigger id={`field-${field}`} className="w-full">
                      <SelectValue placeholder="Selecione uma coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {field === 'id_user' ? (
                        ['JNA', 'CNP'].map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))
                      ) : field === 'delete' ? (
                        <SelectItem value="0">0</SelectItem>
                      ) : (
                        columns.map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {data.length} registros encontrados na planilha.
            </p>
            <Button
              onClick={handleImport}
              disabled={!areAllFieldsMapped()}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              Gerar Queries SQL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
