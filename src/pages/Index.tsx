
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Interface para os dados de autenticação
interface AuthCredentials {
  email: string;
  senha: string;
}

// Interface para os dados de autenticação retornados pela API
interface AuthResponse {
  id: number;
  id_user: string;
  nome: string;
  email: string;
  aparelho: string;
  assentamento: string;
  token: string;
}

interface AmostraResponse {
  id: number;
  id_produtor: number;
  talhao: string;
  nome: string;
  assentamento: string;
  cidade: string;
  sobrenome: string;
  cpf: string;
  propriedade: string;
  area: number;
}

// Interface para os dados do banco de dados baseado na entidade Analise
interface SoilAnalysis {
  id_user: string;
  id_produtor: number | null;
  codigo: string;
  areia: number | null;
  argila: number | null;
  silte: number | null;
  zinco: number | null;
  manganes: number | null;
  ferro: number | null;
  cobre: number | null;
  boro: number | null;
  saturacaoAluminio: number | null;
  saturacaoBases: number | null;
  ctcph: number | null;
  ctcEfetiva: number | null;
  somaBases: number | null;
  materiaOrganica: number | null;
  hidrogenioAluminio: number | null;
  aluminio: number | null;
  magnesio: number | null;
  calcio: number | null;
  enxofre: number | null;
  potassio: number | null;
  fosforoMehlich: number | null;
  phCacl: number | null;
  necessidadeCalagemTalhao: number | null;
  necessidadeCalagemHa: number | null;
  cultura: string | null;
  classificacaoTextural: string | null;
  delete: number;
  id_amostra: number | null;
  fosfatagemHa: number | null;
  fosfatagemTalhao: number | null;
  potassioHa: number | null;
  potassioTalhao: number | null;
  data: string;
  talhao: string | null;
  assentamento: string | null;
  cidade: string | null;
  nome: string | null;
  cpf: string | null;
  propriedade: string | null;
  area: number | null;
}

// Interface para os dados da amostra
interface SoilSample {
  id_user: string;
  id_produtor: number | null;
  codigo: string;
  talhao: string | null;
  area: number | null;
  culturaatual: string | null;
  culturaimplementar: string | null;
  delete: number;
  informacoes: string | null;
  pontos: string | null;
  assentamento: string | null;
  data: string;
  nome: string | null;
  cpf: string | null;
}

// Mapeamento dos campos do banco original para a nova API para análises
const analiseFieldMapping = {
  'id_user': 'id_user',
  'cod': 'codigo',
  'areia_total': 'areia_total',
  'silte': 'silte',
  'argila': 'argila',
  'zn': 'zn',
  'mn': 'mn',
  'fe': 'fe',
  'cu': 'cu',
  'b': 'b',
  'm': 'm',
  'v': 'v',
  'ctcph': 'ctcph',
  'ctc': 'ctc',
  'sb': 'sb',
  'mo': 'mo',
  'hal': 'hal',
  'al3': 'al3',
  'mg': 'mg',
  'ca': 'ca',
  's': 's',
  'k': 'k',
  'pmeh': 'pmeh',
  'phcacl2': 'phcacl2',
  'cultura': 'cultura',
  'classtext': 'classtext',
  'delete': 'delete',
  'data': 'data',
};

// Mapeamento dos campos para amostras
const amostraFieldMapping = {
  'id_user': 'id_user',
  'id_produtor': 'id_produtor',
  'codigo': 'codigo',
  'talhao': 'talhao',
  'area': 'area',
  'culturaatual': 'culturaatual',
  'culturaimplementar': 'culturaimplementar',
  'delete': 'delete',
  'informacoes': 'infos', // Mapeando para o nome correto no banco
  'pontos': 'pontos',
  'assentamento': 'assentamento',
  'data': 'data',
  'nome': 'nome',
  'cpf': 'cpf',
};

// Criar arrays com os nomes dos campos para facilitar o mapeamento
const analiseDbFields = [
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
  'hal',
  'al3',
  'mg',
  'ca',
  's',
  'k',
  'pmeh',
  'phcacl2',
  'mo',
  'delete',
  'data',
];

// Campos calculados que não precisam de mapeamento
const calculatedFields = [
  'sb',
  'ctc',
  'ctcph',
  'v',
  'm',
  'classtext'
];

// Campos para amostras
const amostraDbFields = [
  'id_user',
  'id_produtor',
  'codigo',
  'talhao',
  'area',
  'culturaatual',
  'culturaimplementar',
  'delete',
  'informacoes',
  'pontos',
  'assentamento',
  'data',
  'nome',
  'cpf',
];

type FieldType = 'string' | 'number' | 'date';

// Mapeamento dos tipos de cada campo para análises
const analiseFieldTypes: Record<string, FieldType> = {
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
  cultura: 'string',
  classtext: 'string',
  delete: 'number',
  data: 'date',
};

// Mapeamento dos tipos de cada campo para amostras
const amostraFieldTypes: Record<string, FieldType> = {
  id_user: 'string',
  id_produtor: 'number',
  codigo: 'string',
  talhao: 'string',
  area: 'number',
  culturaatual: 'string',
  culturaimplementar: 'string',
  delete: 'number',
  informacoes: 'string',
  pontos: 'string',
  assentamento: 'string',
  data: 'date',
  nome: 'string',
  cpf: 'string',
};

// Função para classificar a textura do solo
const classTextura = (areia: number, argila: number, silte: number) => {
  let texturaSolo;

  if (argila > 60 && areia < 40 && silte < 40) {
    texturaSolo = "Muito Argiloso";
  } else if (argila > 40 && argila < 60 && areia < 45 && silte < 40) {
    texturaSolo = "Argila";
  } else if (argila > 40 && argila < 60 && areia < 20 && silte < 60 && silte > 40) {
    texturaSolo = "Argila Siltosa";
  } else if (argila > 35 && argila < 55 && areia < 65 && areia > 45 && silte < 20) {
    texturaSolo = "Argila Arenosa";
  } else if (argila > 27 && argila < 40 && areia < 20 && silte < 73 && silte > 40) {
    texturaSolo = "Franco Argilo Siltoso";
  } else if (argila > 27 && argila < 40 && areia < 45 && areia > 20 && silte < 55 && silte > 15) {
    texturaSolo = "Franco Argiloso";
  } else if (argila > 20 && argila < 35 && areia < 80 && areia > 45 && silte < 28) {
    texturaSolo = "Franco Argilo Arenoso";
  } else if (argila > 8 && argila < 27 && areia < 52 && areia > 23 && silte > 28 && silte < 50) {
    texturaSolo = "Franco";
  } else if (argila > 0 && argila < 27 && areia < 50 && areia > 0 && silte > 63) {
    if (argila < 12 && areia < 20 && silte > 80) {
      texturaSolo = "Silte";
    } else {
      texturaSolo = "Franco Siltoso";
    }
  } else if (argila > 0 && argila < 20 && areia > 52 && silte < 50) {
    if (argila >= 10) {
      if (argila < 20 && areia <= 81 && areia > 52 && silte < 50) {
        texturaSolo = "Franco Arenoso";
      } else if (argila < 15 && areia > 81 && areia < 86 && silte <= 25) {
        texturaSolo = "Areia Franca";
      } else {
        texturaSolo = "Areia";
      }
    } else {
      if (argila < 20 && areia <= 76 && areia > 52 && silte < 50) {
        texturaSolo = "Franco Arenoso";
      } else if (argila < 15 && areia > 75 && areia < 86 && silte <= 25) {
        texturaSolo = "Areia Franca";
      } else {
        texturaSolo = "Areia";
      }
    }
  } else {
    texturaSolo = "Indeterminado"; // Para o caso onde nenhuma das condições se aplica
  }

  return texturaSolo;
};

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authCredentials, setAuthCredentials] = useState<AuthCredentials>({
    email: "",
    senha: ""
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [importProgress, setImportProgress] = useState<{
    total: number;
    processed: number;
    success: number;
    failed: number;
  }>({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
  });
  const [activeTab, setActiveTab] = useState("analises");
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

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthCredentials({
      ...authCredentials,
      [name]: value,
    });
  };

  const handleAuthenticate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://solifbackend-development.up.railway.app/solovivo/usuario?email=${authCredentials.email}&senha=${authCredentials.senha}`
      );

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const authData: AuthResponse = await response.json();
      setAuthToken(authData.token);
      setIsAuthenticated(true);
      
      toast({
        title: "Autenticado com sucesso",
        description: `Bem-vindo, ${authData.nome}`,
      });
    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast({
        title: "Erro de autenticação",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDbFields = () => {
    return activeTab === "analises" ? analiseDbFields : amostraDbFields;
  };

  const getCurrentFieldTypes = () => {
    return activeTab === "analises" ? analiseFieldTypes : amostraFieldTypes;
  };

  const areRequiredFieldsMapped = () => {
    // Lista de campos obrigatórios que devem ser mapeados
    const requiredFields = [
      'id_user',
      activeTab === "analises" ? 'cod' : 'codigo',
    ];
    
    return requiredFields.every(field => columnMapping[field] && columnMapping[field] !== 'none');
  };

  // Função para calcular os campos derivados para análises
  const calculateDerivedFields = (row: any) => {
    const mappedValues: Record<string, any> = {};
    
    // Primeiro, extrair os valores mapeados dos campos básicos
    Object.entries(columnMapping).forEach(([dbField, excelColumn]) => {
      if (excelColumn && excelColumn !== 'none' && row[excelColumn] !== undefined) {
        let value = row[excelColumn];
        
        // Converter para número se o campo for numérico
        if (getCurrentFieldTypes()[dbField] === 'number') {
          value = parseFloat(value);
          if (isNaN(value)) value = 0;
        }
        
        mappedValues[dbField] = value;
      }
    });
    
    // Adicionar a data selecionada
    if (selectedDate) {
      mappedValues['data'] = format(selectedDate, 'yyyy-MM-dd');
    }

    // Definir valor padrão para delete
    if (!mappedValues['delete']) {
      mappedValues['delete'] = 0;
    }

    if (activeTab === "analises") {
      try {
        // Obter os valores necessários para os cálculos
        const ca = mappedValues['ca'] || 0;
        const mg = mappedValues['mg'] || 0;
        const kRaw = mappedValues['k'] || 0;
        const k = kRaw / 391; // Conversão conforme a fórmula
        const al3 = mappedValues['al3'] || 0;
        const hal = mappedValues['hal'] || 0;
        const areia = mappedValues['areia_total'] || 0;
        const silte = mappedValues['silte'] || 0;
        const argila = mappedValues['argila'] || 0;

        // Realizar os cálculos
        const sb = ca + mg + k;
        const ctc = sb + al3; // tt = sb + al
        const ctcph = sb + hal; // ttt = sb + hal
        const v = (sb / ctcph) * 100;
        const m = (al3 / ctc) * 100;

        // Adicionar os campos calculados
        mappedValues['sb'] = sb;
        mappedValues['ctc'] = ctc;
        mappedValues['ctcph'] = ctcph;
        mappedValues['v'] = v;
        mappedValues['m'] = m;

        // Calcular a classificação textural
        mappedValues['classtext'] = classTextura(areia/10, argila/10, silte/10);
      } catch (error) {
        console.error('Erro ao calcular campos derivados:', error);
      }
    }

    return mappedValues;
  };

  const adicionarDados = async (mappedValues: Record<string, any>) => {
    if (activeTab !== "analises") return mappedValues; // Não buscar dados adicionais para amostras
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://solifbackend-development.up.railway.app/solovivo/amostra/buscar/produtor/${mappedValues['cod']}`,
        {
          method: 'GET',
          headers: {
            'Authorization': authToken
          },
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar amostra');
      }

      const authData: AmostraResponse = await response.json();
      mappedValues['id_produtor']=authData.id_produtor;
      mappedValues['id_amostra']=authData.id;
      mappedValues['talhao']=authData.talhao;
      mappedValues['assentamento']=authData.assentamento;
      mappedValues['cidade']=authData.cidade;
      mappedValues['nome']=authData.nome.trim()+' '+authData.sobrenome.trim();
      mappedValues['cpf']=authData.assentamento;
      mappedValues['propriedade']=authData.propriedade;
      mappedValues['area']=authData.area;

    } catch (error) {
      console.error('Erro ao buscar amostra:', error);
      toast({
        title: "Erro ao buscar amostra",
        description: "Verifique as informações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    return mappedValues;
  };

  const transformToApiFormat = (mappedValues: Record<string, any>) => {
    if (activeTab === "analises") {
      // Criar um objeto com todos os campos da API definidos como null para análises
      const apiData: SoilAnalysis = {
        id_user: '',
        id_produtor: null,
        codigo: '',
        areia: null,
        silte: null,
        argila: null,
        zinco: null,
        manganes: null,
        ferro: null,
        cobre: null,
        boro: null,
        saturacaoAluminio: null,
        saturacaoBases: null,
        ctcph: null,
        ctcEfetiva: null,
        somaBases: null,
        materiaOrganica: null,
        hidrogenioAluminio: null,
        aluminio: null,
        magnesio: null,
        calcio: null,
        enxofre: null,
        potassio: null,
        fosforoMehlich: null,
        phCacl: null,
        necessidadeCalagemTalhao: null,
        necessidadeCalagemHa: null,
        cultura: null,
        classificacaoTextural: null,
        delete: 0,
        id_amostra: null,
        fosfatagemHa: null,
        fosfatagemTalhao: null,
        potassioHa: null,
        potassioTalhao: null,
        data: format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        talhao: null,
        assentamento: null,
        cidade: null,
        nome: null,
        cpf: null,
        propriedade: null,
        area: null
      };

      // Mapear os valores do formato original para o formato da API para análises
      Object.entries(mappedValues).forEach(([field, value]) => {
        const apiField = analiseFieldMapping[field as keyof typeof analiseFieldMapping];
        if (apiField) {
          (apiData as any)[apiField] = value;
        }
      });

      return apiData;
    } else {
      // Criar um objeto com todos os campos da API definidos como null para amostras
      const apiData: SoilSample = {
        id_user: '',
        id_produtor: null,
        codigo: '',
        talhao: null,
        area: null,
        culturaatual: null,
        culturaimplementar: null,
        delete: 0,
        informacoes: null,
        pontos: null,
        assentamento: null,
        data: format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        nome: null,
        cpf: null
      };

      // Mapear os valores do formato original para o formato da API para amostras
      Object.entries(mappedValues).forEach(([field, value]) => {
        const apiField = amostraFieldMapping[field as keyof typeof amostraFieldMapping];
        if (apiField) {
          (apiData as any)[apiField] = value;
        }
      });

      return apiData;
    }
  };

  const submitToApi = async (rowData: any) => {
    if (!authToken) {
      throw new Error('Token de autenticação não disponível');
    }

    const endpoint = activeTab === "analises" 
      ? 'https://solifbackend-development.up.railway.app/solovivo/analise'
      : 'https://solifbackend-development.up.railway.app/solovivo/amostra';

    const response = await fetch(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(rowData)
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao enviar dados: ${response.status}`);
    }

    return await response.json();
  };

  const handleImport = async () => {
    try {
      if (!areRequiredFieldsMapped()) {
        toast({
          title: "Erro",
          description: "Por favor, mapeie pelo menos os campos obrigatórios (id_user, cod) antes de prosseguir.",
          variant: "destructive",
        });
        return;
      }

      if (!selectedDate) {
        toast({
          title: "Erro",
          description: "Por favor, selecione uma data para continuar.",
          variant: "destructive",
        });
        return;
      }

      if (!authToken) {
        toast({
          title: "Erro",
          description: "Por favor, autentique-se antes de prosseguir.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      setImportProgress({
        total: data.length,
        processed: 0,
        success: 0,
        failed: 0,
      });

      const results = [];
      for (let i = 0; i < data.length; i++) {
        try {
          const row = data[i];
          const mappedValues = calculateDerivedFields(row);
          
          let finalValues = mappedValues;
          if (activeTab === "analises") {
            finalValues = await adicionarDados(mappedValues);
          }
          
          const apiData = transformToApiFormat(finalValues);
          
          const result = await submitToApi(apiData);
          results.push({ success: true, data: result });
          
          setImportProgress(prev => ({
            ...prev,
            processed: prev.processed + 1,
            success: prev.success + 1
          }));
        } catch (error) {
          console.error('Erro ao processar linha', i, error);
          results.push({ success: false, error });
          
          setImportProgress(prev => ({
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1
          }));
        }
      }

      const successCount = results.filter(r => r.success).length;
      toast({
        title: "Importação concluída",
        description: `${successCount} de ${data.length} registros importados com sucesso.`,
        variant: successCount === data.length ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error('Erro durante a importação:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante a importação dos dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setData([]);
    setColumns([]);
    setColumnMapping({});
    setSelectedDate(new Date());
    setImportProgress({
      total: 0,
      processed: 0,
      success: 0,
      failed: 0,
    });
  };

  const getMappedFieldsCount = () => {
    const currentDbFields = getCurrentDbFields();
    return Object.keys(columnMapping)
      .filter(key => currentDbFields.includes(key) && columnMapping[key] && columnMapping[key] !== 'none')
      .length;
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

  // Renderização do formulário de autenticação
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Importador de Planilhas</h1>
        
        <div className="max-w-md mx-auto bg-white p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Autenticação</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={authCredentials.email}
                onChange={handleCredentialsChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input 
                id="senha"
                name="senha"
                type="password"
                value={authCredentials.senha}
                onChange={handleCredentialsChange}
              />
            </div>
            
            <Button 
              className="w-full"
              onClick={handleAuthenticate}
              disabled={isLoading || !authCredentials.email || !authCredentials.senha}
            >
              {isLoading ? "Autenticando..." : "Entrar"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <Tabs defaultValue="analises" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analises">Inserir Análises</TabsTrigger>
                <TabsTrigger value="amostras">Inserir Amostras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analises" className="space-y-4">
                <p className="mb-4 text-sm text-gray-600">
                  Selecione a coluna da planilha que corresponde a cada campo do banco de dados. 
                  Você mapeou {getMappedFieldsCount()} de {analiseDbFields.length} campos.
                </p>
                
                {/* Seletor de data para Análises */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-1 block">
                    Data da Análise
                    <span className="text-xs text-gray-500 ml-1">(obrigatório)</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        locale={ptBR}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analiseDbFields
                    .filter(field => field !== 'data') // Excluir o campo 'data' pois agora usamos o calendário
                    .map((field) => (
                    <div key={field} className="space-y-1">
                      <label htmlFor={`field-${field}`} className="text-sm font-medium">
                        {field}
                        <span className="text-xs text-gray-500 ml-1">
                          ({analiseFieldTypes[field]})
                          {field === 'id_user' || field === 'cod' ? ' (obrigatório)' : ''}
                        </span>
                      </label>
                      <Select
                        value={columnMapping[field] || "none"}
                        onValueChange={(value) => handleColumnMappingChange(field, value)}
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
              </TabsContent>
              
              <TabsContent value="amostras" className="space-y-4">
                <p className="mb-4 text-sm text-gray-600">
                  Selecione a coluna da planilha que corresponde a cada campo da amostra. 
                  Você mapeou {getMappedFieldsCount()} de {amostraDbFields.length} campos.
                </p>
                
                {/* Seletor de data para Amostras */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-1 block">
                    Data da Amostra
                    <span className="text-xs text-gray-500 ml-1">(obrigatório)</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        locale={ptBR}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {amostraDbFields
                    .filter(field => field !== 'data') // Excluir o campo 'data' pois agora usamos o calendário
                    .map((field) => (
                    <div key={field} className="space-y-1">
                      <label htmlFor={`field-${field}`} className="text-sm font-medium">
                        {field}
                        <span className="text-xs text-gray-500 ml-1">
                          ({amostraFieldTypes[field]})
                          {field === 'id_user' || field === 'codigo' ? ' (obrigatório)' : ''}
                        </span>
                      </label>
                      <Select
                        value={columnMapping[field] || "none"}
                        onValueChange={(value) => handleColumnMappingChange(field, value)}
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
              </TabsContent>
            </Tabs>
          </div>
          
          {importProgress.total > 0 && (
            <div className="bg-white p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Progresso da Importação</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(importProgress.processed / importProgress.total) * 100}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>Processados: {importProgress.processed} / {importProgress.total}</p>
                  <p>Sucesso: {importProgress.success}</p>
                </div>
                <div>
                  <p>Falhas: {importProgress.failed}</p>
                  <p>Restantes: {importProgress.total - importProgress.processed}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {data.length} registros encontrados na planilha.
            </p>
            <Button
              onClick={handleImport}
              disabled={!areRequiredFieldsMapped() || !selectedDate || isLoading}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              {isLoading ? "Importando..." : "Importar Dados"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
