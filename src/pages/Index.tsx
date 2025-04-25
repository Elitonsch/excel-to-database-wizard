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

interface AuthCredentials {
  email: string;
  senha: string;
}

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

interface SoilAnalysis {
  id_user: string;
  id_produtor: number | null;
  codigo: string;
  areia_total: number | null;
  silte: number | null;
  argila: number | null;
  zn: number | null;
  mn: number | null;
  fe: number | null;
  cu: number | null;
  b: number | null;
  m: number | null;
  v: number | null;
  ctcph: number | null;
  ctc: number | null;
  sb: number | null;
  mo: number | null;
  hal: number | null;
  al3: number | null;
  mg: number | null;
  ca: number | null;
  s: number | null;
  k: number | null;
  pmeh: number | null;
  phcacl2: number | null;
  nc_talhao: number | null;
  nc: number | null;
  cultura: string | null;
  classtext: string | null;
  delete: number;
  id_amostra: number | null;
  fosfatagem: number | null;
  fosfatagem_talhao: number | null;
  potassio: number | null;
  potassio_talhao: number | null;
  data: string;
  talhao: string | null;
  assentamento: string | null;
  cidade: string | null;
  nome: string | null;
  cpf: string | null;
  propriedade: string | null;
  area: number | null;
}

interface SoilSample {
  id_user: string;
  id_produtor: number | null;
  codigo: string;
  talhao: string | null;
  area: number | null;
  culturaatual: string | null;
  culturaimplementar: string | null;
  delete: number;
  infos: string | null;
  pontos: string | null;
  assentamento: string | null;
  data: string;
  nome: string | null;
  cpf: string | null;
}

interface DuplicateItem {
  codigo: string;
  tipo: 'analise' | 'amostra';
}

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
    texturaSolo = "Indeterminado";
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
  const [duplicateItems, setDuplicateItems] = useState<DuplicateItem[]>([]);
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
    return activeTab === "analises" ? 
      ['id_user', 'cod', 'areia_total', 'silte', 'argila', 'zn', 'mn', 'fe', 'cu', 'b', 'hal', 'al3', 'mg', 'ca', 's', 'k', 'pmeh', 'phcacl2', 'mo'] :
      ['id_user', 'id_produtor', 'codigo', 'talhao', 'area', 'culturaatual', 'culturaimplementar', 'informacoes', 'pontos', 'assentamento', 'nome', 'cpf'];
  };

  const getCurrentFieldTypes = () => {
    return activeTab === "analises" ? 
      {
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
      } : 
      {
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
  };

  const areRequiredFieldsMapped = () => {
    const allFields = activeTab === "analises" ? 
      ['id_user', 'cod', 'areia_total', 'silte', 'argila', 'zn', 'mn', 'fe', 'cu', 'b', 'hal', 'al3', 'mg', 'ca', 's', 'k', 'pmeh', 'phcacl2', 'mo'] :
      ['id_user', 'id_produtor', 'codigo', 'talhao', 'area', 'culturaatual', 'culturaimplementar', 'informacoes', 'pontos', 'assentamento', 'nome', 'cpf'];
    
    return allFields.every(field => columnMapping[field] && columnMapping[field] !== 'none');
  };

  const calculateDerivedFields = (row: any) => {
    const mappedValues: Record<string, any> = {};
    
    Object.entries(columnMapping).forEach(([dbField, excelColumn]) => {
      if (excelColumn && excelColumn !== 'none' && row[excelColumn] !== undefined) {
        let value = row[excelColumn];
        
        if (getCurrentFieldTypes()[dbField] === 'number') {
          value = parseFloat(value);
          if (isNaN(value)) value = 0;
        }
        
        mappedValues[dbField] = value;
      }
    });
    
    if (selectedDate) {
      mappedValues['data'] = format(selectedDate, 'yyyy-MM-dd');
    }

    if (!mappedValues['delete']) {
      mappedValues['delete'] = 0;
    }

    if (activeTab === "analises") {
      try {
        const ca = mappedValues['ca'] || 0;
        const mg = mappedValues['mg'] || 0;
        const kRaw = mappedValues['k'] || 0;
        const k = kRaw / 391;
        const al3 = mappedValues['al3'] || 0;
        const hal = mappedValues['hal'] || 0;
        const areia = mappedValues['areia_total'] || 0;
        const silte = mappedValues['silte'] || 0;
        const argila = mappedValues['argila'] || 0;

        const sb = ca + mg + k;
        const ctc = sb + al3;
        const ctcph = sb + hal;
        const v = (sb / ctcph) * 100;
        const m = (al3 / ctc) * 100;

        mappedValues['sb'] = sb;
        mappedValues['ctc'] = ctc;
        mappedValues['ctcph'] = ctcph;
        mappedValues['v'] = v;
        mappedValues['m'] = m;

        mappedValues['classtext'] = classTextura(areia/10, argila/10, silte/10);
      } catch (error) {
        console.error('Erro ao calcular campos derivados:', error);
      }
    }

    return mappedValues;
  };

  const adicionarDados = async (mappedValues: Record<string, any>) => {
    if (activeTab !== "analises") return mappedValues;

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://solifbackend-development.up.railway.app/solovivo/amostra/buscar/produtor/${mappedValues['cod']}`,
        {
          method: 'GET',
          headers: {
            'Authorization': authToken || '',
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
      const apiData: SoilAnalysis = {
        id_user: '',
        id_produtor: null,
        codigo: '',
        areia_total: null,
        silte: null,
        argila: null,
        zn: null,
        mn: null,
        fe: null,
        cu: null,
        b: null,
        m: null,
        v: null,
        ctcph: null,
        ctc: null,
        sb: null,
        mo: null,
        hal: null,
        al3: null,
        mg: null,
        ca: null,
        s: null,
        k: null,
        pmeh: null,
        phcacl2: null,
        nc_talhao: null,
        nc: null,
        cultura: null,
        classtext: null,
        delete: 0,
        id_amostra: null,
        fosfatagem: null,
        fosfatagem_talhao: null,
        potassio: null,
        potassio_talhao: null,
        data: format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        talhao: null,
        assentamento: null,
        cidade: null,
        nome: null,
        cpf: null,
        propriedade: null,
        area: null
      };

      if (mappedValues['id_user']) apiData.id_user = mappedValues['id_user'];
      if (mappedValues['id_produtor']) apiData.id_produtor = mappedValues['id_produtor'];
      if (mappedValues['cod']) apiData.codigo = mappedValues['cod'];
      if (mappedValues['areia_total'] !== undefined) apiData.areia_total = mappedValues['areia_total'];
      if (mappedValues['silte'] !== undefined) apiData.silte = mappedValues['silte'];
      if (mappedValues['argila'] !== undefined) apiData.argila = mappedValues['argila'];
      if (mappedValues['zn'] !== undefined) apiData.zn = mappedValues['zn'];
      if (mappedValues['mn'] !== undefined) apiData.mn = mappedValues['mn'];
      if (mappedValues['fe'] !== undefined) apiData.fe = mappedValues['fe'];
      if (mappedValues['cu'] !== undefined) apiData.cu = mappedValues['cu'];
      if (mappedValues['b'] !== undefined) apiData.b = mappedValues['b'];
      if (mappedValues['m'] !== undefined) apiData.m = mappedValues['m'];
      if (mappedValues['v'] !== undefined) apiData.v = mappedValues['v'];
      if (mappedValues['ctcph'] !== undefined) apiData.ctcph = mappedValues['ctcph'];
      if (mappedValues['ctc'] !== undefined) apiData.ctc = mappedValues['ctc'];
      if (mappedValues['sb'] !== undefined) apiData.sb = mappedValues['sb'];
      if (mappedValues['mo'] !== undefined) apiData.mo = mappedValues['mo'];
      if (mappedValues['hal'] !== undefined) apiData.hal = mappedValues['hal'];
      if (mappedValues['al3'] !== undefined) apiData.al3 = mappedValues['al3'];
      if (mappedValues['mg'] !== undefined) apiData.mg = mappedValues['mg'];
      if (mappedValues['ca'] !== undefined) apiData.ca = mappedValues['ca'];
      if (mappedValues['s'] !== undefined) apiData.s = mappedValues['s'];
      if (mappedValues['k'] !== undefined) apiData.k = mappedValues['k'];
      if (mappedValues['pmeh'] !== undefined) apiData.pmeh = mappedValues['pmeh'];
      if (mappedValues['phcacl2'] !== undefined) apiData.phcacl2 = mappedValues['phcacl2'];
      if (mappedValues['nc_talhao'] !== undefined) apiData.nc_talhao = mappedValues['nc_talhao'];
      if (mappedValues['nc'] !== undefined) apiData.nc = mappedValues['nc'];
      if (mappedValues['cultura']) apiData.cultura = mappedValues['cultura'];
      if (mappedValues['classtext']) apiData.classtext = mappedValues['classtext'];
      if (mappedValues['delete'] !== undefined) apiData.delete = mappedValues['delete'];
      if (mappedValues['id_amostra']) apiData.id_amostra = mappedValues['id_amostra'];
      if (mappedValues['fosfatagem'] !== undefined) apiData.fosfatagem = mappedValues['fosfatagem'];
      if (mappedValues['fosfatagem_talhao'] !== undefined) apiData.fosfatagem_talhao = mappedValues['fosfatagem_talhao'];
      if (mappedValues['potassio'] !== undefined) apiData.potassio = mappedValues['potassio'];
      if (mappedValues['potassio_talhao'] !== undefined) apiData.potassio_talhao = mappedValues['potassio_talhao'];
      if (mappedValues['talhao']) apiData.talhao = mappedValues['talhao'];
      if (mappedValues['assentamento']) apiData.assentamento = mappedValues['assentamento'];
      if (mappedValues['cidade']) apiData.cidade = mappedValues['cidade'];
      if (mappedValues['nome']) apiData.nome = mappedValues['nome'];
      if (mappedValues['cpf']) apiData.cpf = mappedValues['cpf'];
      if (mappedValues['propriedade']) apiData.propriedade = mappedValues['propriedade'];
      if (mappedValues['area'] !== undefined) apiData.area = mappedValues['area'];

      return apiData;
    } else {
      const apiData: SoilSample = {
        id_user: '',
        id_produtor: null,
        codigo: '',
        talhao: null,
        area: null,
        culturaatual: null,
        culturaimplementar: null,
        delete: 0,
        infos: null,
        pontos: null,
        assentamento: null,
        data: format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        nome: null,
        cpf: null
      };

      if (mappedValues['id_user']) apiData.id_user = mappedValues['id_user'];
      if (mappedValues['id_produtor']) apiData.id_produtor = mappedValues['id_produtor'];
      if (mappedValues['codigo']) apiData.codigo = mappedValues['codigo'];
      if (mappedValues['talhao']) apiData.talhao = mappedValues['talhao'];
      if (mappedValues['area'] !== undefined) apiData.area = mappedValues['area'];
      if (mappedValues['culturaatual']) apiData.culturaatual = mappedValues['culturaatual'];
      if (mappedValues['culturaimplementar']) apiData.culturaimplementar = mappedValues['culturaimplementar'];
      if (mappedValues['delete'] !== undefined) apiData.delete = mappedValues['delete'];
      if (mappedValues['informacoes']) apiData.infos = mappedValues['informacoes'];
      if (mappedValues['pontos']) apiData.pontos = mappedValues['pontos'];
      if (mappedValues['assentamento']) apiData.assentamento = mappedValues['assentamento'];
      if (mappedValues['nome']) apiData.nome = mappedValues['nome'];
      if (mappedValues['cpf']) apiData.cpf = mappedValues['cpf'];

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

  const checkItemExists = async (codigo: string, tipo: 'analise' | 'amostra'): Promise<boolean> => {
    try {
      const endpoint = tipo === 'analise' 
        ? `https://solifbackend-development.up.railway.app/solovivo/analise/buscar/${codigo}`
        : `https://solifbackend-development.up.railway.app/solovivo/amostra/buscar/${codigo}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': authToken || '',
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error('Erro ao verificar item:', error);
      return false;
    }
  };

  const handleImport = async () => {
    try {
      if (!areRequiredFieldsMapped()) {
        toast({
          title: "Erro",
          description: "Por favor, mapeie pelo menos os campos obrigatórios antes de prosseguir.",
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
      setDuplicateItems([]);
      setImportProgress({
        total: data.length,
        processed: 0,
        success: 0,
        failed: 0,
      });

      const results = [];
      const newDuplicates: DuplicateItem[] = [];
      
      for (let i = 0; i < data.length; i++) {
        try {
          const row = data[i];
          const mappedValues = calculateDerivedFields(row);
          
          const codeField = activeTab === 'analises' ? 'cod' : 'codigo';
          const code = mappedValues[codeField];
          
          const itemExists = await checkItemExists(
            code, 
            activeTab === 'analises' ? 'analise' : 'amostra'
          );

          if (itemExists) {
            newDuplicates.push({
              codigo: code,
              tipo: activeTab === 'analises' ? 'analise' : 'amostra'
            });
            
            setImportProgress(prev => ({
              ...prev,
              processed: prev.processed + 1,
              failed: prev.failed + 1
            }));
            continue;
          }

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

      setDuplicateItems(newDuplicates);
      const successCount = results.filter(r => r.success).length;
      
      if (newDuplicates.length > 0) {
        toast({
          title: `${newDuplicates.length} ${activeTab === 'analises' ? 'análises' : 'amostras'} já cadastradas`,
          description: `Os seguintes itens não foram inseridos pois já estão cadastrados: ${newDuplicates.map(item => item.codigo).join(', ')}`,
          variant: "destructive",
        });
      }

      toast({
        title: "Importação concluída",
        description: `${successCount} de ${data.length} registros importados com sucesso.`,
        variant: successCount === 0 ? "destructive" : "default",
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
    setDuplicateItems([]);
  };

  const getMappedFieldsCount = () => {
    const currentDbFields = getCurrentDbFields();
    return Object.keys(columnMapping)
      .filter(key => currentDbFields.includes(key) && columnMapping[key] && columnMapping[key] !== 'none')
      .length;
  };

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
                  Você mapeou {getMappedFieldsCount()} de {getCurrentDbFields().length} campos.
                </p>
                
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
                  {getCurrentDbFields()
                    .filter(field => field !== 'data' && field !== 'delete')
                    .map((field) => (
                    <div key={field} className="space-y-1">
                      <label htmlFor={`field-${field}`} className="text-sm font-medium">
                        {field}
                        <span className="text-xs text-red-500 ml-1">*</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({getCurrentFieldTypes()[field]})
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
                  Você mapeou {getMappedFieldsCount()} de {getCurrentDbFields().length} campos.
                </p>
                
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
                  {getCurrentDbFields()
                    .filter(field => field !== 'data' && field !== 'delete')
                    .map((field) => (
                    <div key={field} className="space-y-1">
                      <label htmlFor={`field-${field}`} className="text-sm font-medium">
                        {field}
                        <span className="text-xs text-red-500 ml-1">*</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({getCurrentFieldTypes()[field]})
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
          
          {duplicateItems.length > 0 && (
            <div className="bg-white p-4 border rounded-lg border-amber-500">
              <h3 className="text-lg font-medium mb-2 text-amber-700">Itens já cadastrados</h3>
              <p className="text-sm text-gray-700 mb-2">
                Os seguintes códigos já estão cadastrados no sistema:
              </p>
              <div className="flex flex-wrap gap-2">
                {duplicateItems.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                    {item.codigo}
                  </span>
                ))}
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
