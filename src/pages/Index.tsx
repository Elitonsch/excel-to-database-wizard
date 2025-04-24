
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
  id_produtor: number;
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
  id_amostra: number;
  fosfatagemHa: number;
  fosfatagemTalhao: number;
  potassioHa: number;
  potassioTalhao: number;
  data: string;
  talhao: string;
  assentamento: string;
  cidade: string;
  nome: string;
  cpf: string;
  propriedade: string;
  area: number;
}

// Criar um array com os nomes dos campos para facilitar o mapeamento
const dbFields = [
  'id_user',
  'id_produtor',
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
  'id_amostra',
  'fosfatagemHa',
  'fosfatagemTalhao',
  'potassioHa',
  'potassioTalhao',
  'data',
  'talhao',
  'assentamento',
  'cidade',
  'nome',
  'cpf',
  'propriedade',
  'area',
];

type FieldType = 'string' | 'number' | 'date';

// Mapeamento dos tipos de cada campo
const fieldTypes: Record<string, FieldType> = {
  id_user: 'string',
  id_produtor: 'number',
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
  id_amostra: 'number',
  fosfatagemHa: 'number',
  fosfatagemTalhao: 'number',
  potassioHa: 'number',
  potassioTalhao: 'number',
  data: 'date',
  talhao: 'string',
  assentamento: 'string',
  cidade: 'string',
  nome: 'string',
  cpf: 'string',
  propriedade: 'string',
  area: 'number',
};

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleFileLoaded = (jsonData: any[], headers: string[]) => {
    setData(jsonData);
    setColumns(headers);
    setColumnMapping({}); // Reset column mapping when new file is loaded
  };

  const handleColumnMappingChange = (dbField: string, excelColumn: string) => {
    setColumnMapping({
      ...columnMapping,
      [dbField]: excelColumn,
    });
  };

  const handleImport = async () => {
    try {
      // Preparar os dados para inserção no PostgreSQL
      const mappedData = data.map(row => {
        const dbRow: Partial<DatabaseSchema> = {};
        
        // Aplicar o mapeamento de colunas
        Object.entries(columnMapping).forEach(([dbField, excelColumn]) => {
          if (excelColumn && row[excelColumn] !== undefined) {
            // Converter o tipo de dado conforme necessário
            const typedField = dbField as keyof DatabaseSchema;
            
            switch(fieldTypes[dbField]) {
              case 'number':
                dbRow[typedField] = Number(row[excelColumn]);
                break;
              case 'date':
                // Se for uma data no formato de string, converte para o formato ISO
                if (typeof row[excelColumn] === 'string') {
                  dbRow[typedField] = new Date(row[excelColumn]).toISOString();
                } else if (row[excelColumn] instanceof Date) {
                  dbRow[typedField] = row[excelColumn].toISOString();
                } else {
                  dbRow[typedField] = row[excelColumn];
                }
                break;
              default:
                dbRow[typedField] = String(row[excelColumn]);
                break;
            }
          }
        });
        
        return dbRow;
      });
      
      console.log('Dados preparados para serem inseridos no PostgreSQL:', mappedData);
      
      // Simular a chamada para a API que inserirá os dados no PostgreSQL
      // Na implementação real, você substituirá isso por uma chamada real para sua API
      /*
      const response = await fetch('/api/importData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: mappedData }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao inserir dados no banco de dados');
      }
      
      const result = await response.json();
      */
      
      // Simulação bem-sucedida
      toast({
        title: "Sucesso",
        description: `${mappedData.length} registros prontos para inserção no PostgreSQL. Veja o console para detalhes.`,
      });
      
      // Resetar o estado após a importação bem-sucedida
      setData([]);
      setColumns([]);
      setColumnMapping({});
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
    return Object.keys(columnMapping).filter(key => columnMapping[key] !== '').length;
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
                      {columns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
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
              disabled={getMappedFieldsCount() === 0}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              Importar para o PostgreSQL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
