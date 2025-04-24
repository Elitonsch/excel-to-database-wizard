
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Database, X, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Database schema with updated field names
interface DatabaseSchema {
  id_user: string;
  cod: string;
  areia_total: number;
  silte: number;
  argila: number;
  zn: number;
  mn: number;
  fe: number;
  cu: number;
  b: number;
  m: number;
  v: number;
  ctcph: number;
  ctc: number;
  sb: number;
  mo: number;
  hal: number;
  al3: number;
  mg: number;
  ca: number;
  s: number;
  k: number;
  pmeh: number;
  phcacl2: number;
  nc_talhao: number;
  nc: number;
  cultura: string;
  classtext: string;
  delete: number;
  data: Date;
  talhao: string;
}

// Updated array with the new field names
const dbFields = [
  'id_user',
  'cod',
  'areia_total',
  'silte',
  'argila',
  'zn',
  'mn',
  'fe',
  'cu',
  'b',
  'm',
  'v',
  'ctcph',
  'ctc',
  'sb',
  'mo',
  'hal',
  'al3',
  'mg',
  'ca',
  's',
  'k',
  'pmeh',
  'phcacl2',
  'nc_talhao',
  'nc',
  'cultura',
  'classtext',
  'delete',
  'data',
  'talhao',
];

type FieldType = 'string' | 'number' | 'date';

// Updated field types mapping
const fieldTypes: Record<string, FieldType> = {
  id_user: 'string',
  cod: 'string',
  areia_total: 'number',
  silte: 'number',
  argila: 'number',
  zn: 'number',
  mn: 'number',
  fe: 'number',
  cu: 'number',
  b: 'number',
  m: 'number',
  v: 'number',
  ctcph: 'number',
  ctc: 'number',
  sb: 'number',
  mo: 'number',
  hal: 'number',
  al3: 'number',
  mg: 'number',
  ca: 'number',
  s: 'number',
  k: 'number',
  pmeh: 'number',
  phcacl2: 'number',
  nc_talhao: 'number',
  nc: 'number',
  cultura: 'string',
  classtext: 'string',
  delete: 'number',
  data: 'date',
  talhao: 'string',
};

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
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
        if (dbField === 'data') {
          mappedValues[dbField] = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
        } else if (excelColumn && row[excelColumn] !== undefined) {
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
      
      const query = `INSERT INTO analise (${fields.join(', ')}) VALUES (${values.join(', ')});`;
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
    if (field === 'data') {
      return [];
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
                  {field === 'data' ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Selecione uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
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
                  )}
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
