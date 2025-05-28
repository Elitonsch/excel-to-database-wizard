import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Database, X, Check, List, AlertTriangle, Loader } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  idProdutor: number;
  talhao: string;
  nome: string;
  assentamento: string;
  cidade: string;
  sobrenome: string;
  cpf: string;
  propriedade: string;
  area: number;
}

interface Produtor {
  id: number;
  id_user: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  assentamento: string;
  propriedade: string;
  delete: number;
}

interface ProdutorResponse {
  content: Produtor[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

interface SoilAnalysis {
  id_user: string;
  id_produtor: number | null;
  codigo: string;
  areia: number | null;
  silte: number | null;
  argila: number | null;
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

interface ClassificacaoDTO {
  id_user: string;
  id_produtor: number | null;
  cod: string;
  phCacl: string;
  calcio: string;
  magnesio: string;
  potassio: string;
  somaBases: string;
  ctcEfetiva: string;
  ctcph: string;
  saturacaoBases: string;
  enxofre: string;
  hidrogenioAluminio: string;
  aluminio: string;
  zinco: string;
  boro: string;
  cobre: string;
  ferro: string;
  manganes: string;
  fosforoMehlich: string;
  id_amostra: number | null;
  delete: number;
  data: string;
}

const Classificar = {
  pHCaCl2: (value: number): string => {
    if (value < 4.4) return "Muito Baixo";
    else if (value >= 4.4 && value < 4.8) return "Baixo";
    else if (value >= 4.8 && value < 5.5) return "Bom";
    else if (value >= 5.5 && value <= 5.8) return "Alto";
    else return "Muito Alto";
  },

  Ca: (value: number): string => {
    if (value < 0.4) return "Muito Baixo";
    else if (value >= 0.4 && value < 1.2) return "Baixo";
    else if (value >= 1.2 && value < 2.4) return "Médio";
    else if (value >= 2.4 && value <= 4) return "Bom";
    else return "Muito Bom";
  },

  Mg: (value: number): string => {
    if (value < 0.15) return "Muito Baixo";
    else if (value >= 0.15 && value < 0.45) return "Baixo";
    else if (value >= 0.45 && value < 0.9) return "Médio";
    else if (value >= 0.9 && value <= 1.5) return "Bom";
    else return "Muito Bom";
  },

  K: (value: number): string => {
    if (value < 15) return "Muito Baixo";
    else if (value >= 15 && value < 40) return "Baixo";
    else if (value >= 40 && value < 70) return "Médio";
    else if (value >= 70 && value <= 120) return "Bom";
    else return "Muito Bom";
  },

  SB: (value: number): string => {
    if (value < 0.6) return "Muito Baixo";
    else if (value >= 0.6 && value < 1.8) return "Baixo";
    else if (value >= 1.8 && value < 3.6) return "Médio";
    else if (value >= 3.6 && value <= 6) return "Bom";
    else return "Muito Bom";
  },

  TT: (value: number): string => {
    if (value < 0.8) return "Muito Baixo";
    else if (value >= 0.8 && value < 2.3) return "Baixo";
    else if (value >= 2.3 && value < 4.6) return "Médio";
    else if (value >= 4.6 && value <= 8) return "Bom";
    else return "Muito Bom";
  },

  TTT: (value: number): string => {
    if (value < 1.6) return "Muito Baixo";
    else if (value >= 1.6 && value < 4.3) return "Baixo";
    else if (value >= 4.3 && value < 8.6) return "Médio";
    else if (value >= 8.6 && value <= 15) return "Bom";
    else return "Muito Bom";
  },

  V: (value: number): string => {
    if (value < 25) return "Muito Baixo";
    else if (value >= 25 && value < 50) return "Baixo";
    else if (value >= 50 && value < 70) return "Médio";
    else if (value >= 70 && value <= 90) return "Alto";
    else return "Muito Alto";
  },

  S: (value: number): string => {
    if (value < 5) return "Muito Baixo";
    else if (value >= 5 && value < 10) return "Baixo";
    else if (value >= 10 && value < 15) return "Médio";
    else if (value >= 15 && value <= 20) return "Bom";
    else return "Muito Bom";
  },

  Al: (value: number): string => {
    if (value < 0.2) return "Muito Bom";
    else if (value >= 0.2 && value < 0.51) return "Bom";
    else if (value >= 0.51 && value < 1.01) return "Médio";
    else if (value >= 1.01 && value <= 2) return "Alto";
    else return "Muito Alto";
  },

  Hal: (value: number): string => {
    if (value < 1) return "Muito Baixo";
    else if (value >= 1 && value < 2.5) return "Baixo";
    else if (value >= 2.5 && value < 5) return "Médio";
    else if (value >= 5 && value <= 9) return "Alto";
    else return "Muito Alto";
  },

  Zn: (value: number): string => {
    if (value < 0.4) return "Muito Baixo";
    else if (value >= 0.4 && value < 0.9) return "Baixo";
    else if (value >= 0.9 && value < 1.5) return "Médio";
    else if (value >= 1.5 && value <= 2.2) return "Bom";
    else return "Muito Bom";
  },

  B: (value: number): string => {
    if (value < 0.15) return "Muito Baixo";
    else if (value >= 0.15 && value < 0.35) return "Baixo";
    else if (value >= 0.35 && value < 0.6) return "Médio";
    else if (value >= 0.6 && value <= 0.9) return "Bom";
    else return "Muito Bom";
  },

  Cu: (value: number): string => {
    if (value < 0.3) return "Muito Baixo";
    else if (value >= 0.3 && value < 0.7) return "Baixo";
    else if (value >= 0.7 && value < 1.2) return "Médio";
    else if (value >= 1.2 && value <= 1.8) return "Bom";
    else return "Muito Bom";
  },

  Fe: (value: number): string => {
    if (value < 8) return "Muito Baixo";
    else if (value >= 8 && value < 18) return "Baixo";
    else if (value >= 18 && value < 30) return "Médio";
    else if (value >= 30 && value <= 45) return "Bom";
    else return "Muito Bom";
  },

  Mn: (value: number): string => {
    if (value < 2) return "Muito Baixo";
    else if (value >= 2 && value < 5) return "Baixo";
    else if (value >= 5 && value < 8) return "Médio";
    else if (value >= 8 && value <= 12) return "Bom";
    else return "Muito Bom";
  },

  Pmeh: (argila: number, pmeh: number): string => {
    if (argila <= 100 && argila >= 60) {
      if (pmeh <= 8) return "Muito Baixo";
      else if (pmeh > 8 && pmeh <= 16) return "Baixo";
      else if (pmeh > 16 && pmeh <= 24) return "Médio";
      else if (pmeh > 24 && pmeh <= 36) return "Bom";
      else return "Muito Bom";
    } else if (argila < 60 && argila >= 35) {
      if (pmeh < 12) return "Muito Baixo";
      else if (pmeh > 12 && pmeh <= 24) return "Baixo";
      else if (pmeh > 24 && pmeh <= 36) return "Médio";
      else if (pmeh > 36 && pmeh <= 54) return "Bom";
      else return "Muito Bom";
    } else if (argila < 35 && argila >= 15) {
      if (pmeh < 20) return "Muito Baixo";
      else if (pmeh > 20 && pmeh <= 36) return "Baixo";
      else if (pmeh > 36 && pmeh <= 60) return "Médio";
      else if (pmeh > 60 && pmeh <= 90) return "Bom";
      else return "Muito Bom";
    } else {
      if (pmeh < 30) return "Muito Baixo";
      else if (pmeh > 30 && pmeh <= 60) return "Baixo";
      else if (pmeh > 60 && pmeh <= 90) return "Médio";
      else if (pmeh > 90 && pmeh <= 135) return "Bom";
      else return "Muito Bom";
    }
  }
};

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
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCultura, setSelectedCultura] = useState('');
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
  const [verifiedSamples, setVerifiedSamples] = useState<{
    found: string[];
    notFound: string[];
    withAnalysis: string[];
    withoutAnalysis: string[];
  }>({
    found: [],
    notFound: [],
    withAnalysis: [],
    withoutAnalysis: [],
  });
  const [failedAnalyses, setFailedAnalyses] = useState<string[]>([]);
  const [verificationProgress, setVerificationProgress] = useState<{
    total: number;
    processed: number;
    currentSample: string;
  }>({
    total: 0,
    processed: 0,
    currentSample: '',
  });
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
        `https://prodata.up.railway.app/solovivo/usuario?email=${authCredentials.email}&senha=${authCredentials.senha}`
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
      ['id_user', 'cod', 'areia_total', 'silte', 'argila', 'zn', 'mn', 'fe', 'cu', 'b', 'hal', 'al3', 'mg', 'ca', 's', 'k', 'pmeh', 'phcacl2', 'mo','cultura'] :
      ['codigo'];
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
        codigo: 'string',
        talhao: 'string',
        area: 'number',
        culturaatual: 'string',
        culturaimplementar: 'string',
        delete: 'number',
        data: 'date',
        cpf: 'string',
      };
  };

  const areRequiredFieldsMapped = () => {
    const allFields = activeTab === "analises" ? 
      ['id_user', 'cod', 'areia_total', 'silte', 'argila', 'zn', 'mn', 'fe', 'cu', 'b', 'hal', 'al3', 'mg', 'ca', 's', 'k', 'pmeh', 'phcacl2', 'mo','cultura'] :
      ['codigo'];
    
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
        mappedValues['k']=k;
        const sb = ca + mg + k;
        const ctc = sb + al3;
        const ctcph = sb + hal;
        const v = (sb / ctcph) * 100;
        const m = (al3 / ctc) * 100;
        
        const Qc =(45 > v) ?  (((45 - v) * ctcph) / 100) : 0;

        const arg=argila/10;
        let nivelcritico=0;
        let ct=0;
        if(arg >=0 && arg <15){
          nivelcritico=20;
          ct=5;
        }else if(arg >=15 && arg <20){
          nivelcritico=18;
          ct=6;
        }else if(arg >=20 && arg <25){
          nivelcritico=17;
          ct=7;
        }else if(arg >=25 && arg <30){
          nivelcritico=15;
          ct=9;
        }else if(arg >=30 && arg <35){
          nivelcritico=14;
          ct=11;
        }else if(arg >=35 && arg <40){
          nivelcritico=13;
          ct=15;
        }else if(arg >=40 && arg <45){
          nivelcritico=11;
          ct=18;
        }else if(arg >=45 && arg <50){
          nivelcritico=10;
          ct=23;
        }else if(arg >=50 && arg <55){
          nivelcritico=8;
          ct=29;
        }else if(arg >=55 && arg <60){
          nivelcritico=7;
          ct=37;
        }else if(arg >=60 && arg <65){
          nivelcritico=5;
          ct=54;
        }else if(arg >=65 && arg <70){
          nivelcritico=4;
          ct=70;
        }

        let fosfat=0;

        fosfat= ((mappedValues['pmeh'] < nivelcritico) ? ((nivelcritico-mappedValues['pmeh'])*ct) : 0);
        let postassio=0;

        postassio = ((k < (ctcph * (3 / 100))) ? (((((ctcph * (3 / 100.0)) - k) * 391.0)*1.2)*2.0) : 0);

        mappedValues['sb'] = sb;
        mappedValues['ctc'] = ctc;
        mappedValues['ctcph'] = ctcph;
        mappedValues['v'] = v;
        mappedValues['m'] = m;
        mappedValues['nc']=Qc;
        mappedValues['fosfatagem']=fosfat;
        mappedValues['potassio']=postassio;

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
        `https://prodata.up.railway.app/solovivo/amostra/buscar/produtor/${mappedValues['cod'].trim()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': authToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar amostra');
      }

      const authData: AmostraResponse = await response.json();

      mappedValues['id_produtor']=authData.idProdutor;
      mappedValues['id_amostra']=authData.id;
      mappedValues['talhao']=authData.talhao;
      mappedValues['assentamento']=authData.assentamento;
      mappedValues['cidade']=authData.cidade;
      mappedValues['nome']=authData.nome.trim()+' '+authData.sobrenome.trim();
      mappedValues['cpf']=authData.cpf;
      mappedValues['propriedade']=authData.propriedade;
      mappedValues['area']=authData.area;
      mappedValues['nc_talhao']=mappedValues['nc']*authData.area;
      mappedValues['fosfatagem_talhao']=mappedValues['fosfatagem']*authData.area;
      mappedValues['potassio_talhao']=mappedValues['potassio']*authData.area;
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

  const adicionarDadosAmostra = async (mappedValues: Record<string, any>) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://prodata.up.railway.app/solovivo/produtor/filter/pagina?nome=${mappedValues['cpf']}`,
        {
          method: 'GET',
          headers: {
            'Authorization': authToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar produtor: ${response.status}`);
      }

      const responseData: ProdutorResponse = await response.json();
      
      if (responseData.content.length === 0) {
        throw new Error('Nenhum produtor encontrado com o CPF informado');
      }

      const produtor = responseData.content[0];
      console.log(produtor);
      mappedValues['id_produtor'] = produtor.id;
      const selectedCulturaAtual = columnMapping['culturaatual'];
      const selectedCulturaImplementar = columnMapping['culturaimplementar'];
      mappedValues['culturaatual'] = selectedCulturaAtual;
      mappedValues['culturaimplementar'] = selectedCulturaImplementar;
      mappedValues['assentamento'] = produtor.assentamento;
      mappedValues['propriedade'] = produtor.propriedade;
      mappedValues['nome'] = produtor.nome.trim() + ' ' + produtor.sobrenome.trim();
      mappedValues['sobrenome'] = produtor.sobrenome;
      mappedValues['telefone'] = produtor.telefone;
      mappedValues['email'] = produtor.email;
      mappedValues['cidade'] = produtor.cidade;
      mappedValues['delete'] = produtor.delete;

      return mappedValues;

    } catch (error) {
      console.error('Erro ao buscar produtor:', error);
      toast({
        title: "Erro ao buscar produtor",
        description: error instanceof Error ? error.message : "Erro desconhecido ao buscar produtor",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const transformToApiFormat = (mappedValues: Record<string, any>) => {
    if (activeTab === "analises") {
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

      apiData.id_user = selectedUserId;
      if (mappedValues['id_produtor']) apiData.id_produtor = mappedValues['id_produtor'];
      if (mappedValues['cod']) apiData.codigo = mappedValues['cod'];
      if (mappedValues['areia_total'] !== undefined) apiData.areia = mappedValues['areia_total'];
      if (mappedValues['silte'] !== undefined) apiData.silte = mappedValues['silte'];
      if (mappedValues['argila'] !== undefined) apiData.argila = mappedValues['argila'];
      if (mappedValues['zn'] !== undefined) apiData.zinco = mappedValues['zn'];
      if (mappedValues['mn'] !== undefined) apiData.manganes = mappedValues['mn'];
      if (mappedValues['fe'] !== undefined) apiData.ferro = mappedValues['fe'];
      if (mappedValues['cu'] !== undefined) apiData.cobre = mappedValues['cu'];
      if (mappedValues['b'] !== undefined) apiData.boro = mappedValues['b'];
      if (mappedValues['m'] !== undefined) apiData.saturacaoAluminio = mappedValues['m'];
      if (mappedValues['v'] !== undefined) apiData.saturacaoBases = mappedValues['v'];
      if (mappedValues['ctcph'] !== undefined) apiData.ctcph = mappedValues['ctcph'];
      if (mappedValues['ctc'] !== undefined) apiData.ctcEfetiva = mappedValues['ctc'];
      if (mappedValues['sb'] !== undefined) apiData.somaBases = mappedValues['sb'];
      if (mappedValues['mo'] !== undefined) apiData.materiaOrganica = mappedValues['mo'];
      if (mappedValues['hal'] !== undefined) apiData.hidrogenioAluminio = mappedValues['hal'];
      if (mappedValues['al3'] !== undefined) apiData.aluminio = mappedValues['al3'];
      if (mappedValues['mg'] !== undefined) apiData.magnesio = mappedValues['mg'];
      if (mappedValues['ca'] !== undefined) apiData.calcio = mappedValues['ca'];
      if (mappedValues['s'] !== undefined) apiData.enxofre = mappedValues['s'];
      if (mappedValues['k'] !== undefined) apiData.potassio = mappedValues['k'];
      if (mappedValues['pmeh'] !== undefined) apiData.fosforoMehlich = mappedValues['pmeh'];
      if (mappedValues['phcacl2'] !== undefined) apiData.phCacl = mappedValues['phcacl2'];
      if (mappedValues['nc_talhao'] !== undefined) apiData.necessidadeCalagemTalhao = mappedValues['nc_talhao'];
      if (mappedValues['nc'] !== undefined) apiData.necessidadeCalagemHa = mappedValues['nc'];
      apiData.cultura =selectedCultura;
      if (mappedValues['classtext']) apiData.classificacaoTextural = mappedValues['classtext'];
      if (mappedValues['delete'] !== undefined) apiData.delete = mappedValues['delete'];
      if (mappedValues['id_amostra']) apiData.id_amostra = mappedValues['id_amostra'];
      if (mappedValues['fosfatagem'] !== undefined) apiData.fosfatagemHa = mappedValues['fosfatagem'];
      if (mappedValues['fosfatagem_talhao'] !== undefined) apiData.fosfatagemTalhao = mappedValues['fosfatagem_talhao'];
      if (mappedValues['potassio'] !== undefined) apiData.potassioHa = mappedValues['potassio'];
      if (mappedValues['potassio_talhao'] !== undefined) apiData.potassioTalhao = mappedValues['potassio_talhao'];
      if (mappedValues['talhao']) apiData.talhao = mappedValues['talhao'];
      if (mappedValues['assentamento']) apiData.assentamento = mappedValues['assentamento'];
      if (mappedValues['cidade']) apiData.cidade = mappedValues['cidade'];
      if (mappedValues['nome']) apiData.nome = mappedValues['nome'];
      if (mappedValues['cpf']) apiData.cpf = mappedValues['cpf'];
      if (mappedValues['propriedade']) apiData.propriedade = mappedValues['propriedade'];
      if (mappedValues['area'] !== undefined) apiData.area = mappedValues['area'];
        console.log(apiData);
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

      if (mappedValues['id_user']) apiData.id_user =selectedUserId;
      if (mappedValues['id_produtor']) apiData.id_produtor = mappedValues['id_produtor'];
      if (mappedValues['codigo']) apiData.codigo = mappedValues['codigo'];
      if (mappedValues['talhao']) apiData.talhao = mappedValues['talhao'];
      if (mappedValues['area'] !== undefined) apiData.area = mappedValues['area'];
      if (mappedValues['cultura']) apiData.culturaatual = mappedValues['culturaatual'];
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
      ? 'https://prodata.up.railway.app/solovivo/analise'
      : 'https://prodata.up.railway.app/solovivo/amostra';

    console.log(JSON.stringify(rowData));
    
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
    
    const responseData = await response.json();
    
    if (activeTab === "analises") {
      try {
        const classificacaoDTO: ClassificacaoDTO = {
          id_user: selectedUserId,
          id_produtor: rowData.id_produtor,
          cod: rowData.codigo,
          phCacl: Classificar.pHCaCl2(rowData.phCacl || 0),
          calcio: Classificar.Ca(rowData.calcio || 0),
          magnesio: Classificar.Mg(rowData.magnesio || 0),
          potassio: Classificar.K((rowData.potassio || 0) * 391),
          somaBases: Classificar.SB(rowData.somaBases || 0),
          ctcEfetiva: Classificar.TT(rowData.ctcEfetiva || 0),
          ctcph: Classificar.TTT(rowData.ctcph || 0),
          saturacaoBases: Classificar.V(rowData.saturacaoBases || 0),
          enxofre: Classificar.S(rowData.enxofre || 0),
          hidrogenioAluminio: Classificar.Hal(rowData.hidrogenioAluminio || 0),
          aluminio: Classificar.Al(rowData.aluminio || 0),
          zinco: Classificar.Zn(rowData.zinco || 0),
          boro: Classificar.B(rowData.boro || 0),
          cobre: Classificar.Cu(rowData.cobre || 0),
          ferro: Classificar.Fe(rowData.ferro || 0),
          manganes: Classificar.Mn(rowData.manganes || 0),
          fosforoMehlich: Classificar.Pmeh((rowData.argila || 0) / 10, rowData.fosforoMehlich || 0),
          id_amostra: rowData.id_amostra,
          delete: 0,
          data: format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        };

        console.log("Enviando dados de classificação:", classificacaoDTO);

        const classificacaoResponse = await fetch(
          'https://prodata.up.railway.app/solovivo/classificacao',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authToken
            },
            body: JSON.stringify(classificacaoDTO)
          }
        );

        if (!classificacaoResponse.ok) {
          console.error('Erro ao enviar classificação:', classificacaoResponse.status);
          throw new Error(`Erro ao enviar classificação: ${classificacaoResponse.status}`);
        }

        const classificacaoResult = await classificacaoResponse.json();
        console.log("Resposta da classificação:", classificacaoResult);
      } catch (error) {
        console.error("Erro ao enviar dados de classificação:", error);
        throw error;
      }
    }
    
    return responseData;
  };

  const checkItemExists = async (codigo: string, tipo: 'analise' | 'amostra'): Promise<boolean> => {
    try {
      const endpoint = tipo === 'analise' 
        ? `https://prodata.up.railway.app/solovivo/analise/buscar/${codigo}`
        : `https://prodata.up.railway.app/solovivo/amostra/buscar/${codigo}`;

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

  const verifySamples = async () => {
    try {
      if (!columnMapping['codigo'] || columnMapping['codigo'] === 'none') {
        toast({
          title: "Erro",
          description: "Por favor, selecione a coluna com os códigos das amostras.",
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
      setVerificationProgress({
        total: data.length,
        processed: 0,
        currentSample: '',
      });
      
      const found: string[] = [];
      const notFound: string[] = [];
      const withAnalysis: string[] = [];
      const withoutAnalysis: string[] = [];
      
      for (let i = 0; i < data.length; i++) {
        try {
          const row = data[i];
          const codigo = row[columnMapping['codigo']];
          
          if (!codigo) {
            setVerificationProgress(prev => ({
              ...prev,
              processed: prev.processed + 1,
            }));
            continue;
          }

          setVerificationProgress(prev => ({
            ...prev,
            currentSample: codigo,
          }));
          
          const response = await fetch(
            `https://prodata.up.railway.app/solovivo/amostra/buscar/${codigo}`,
            {
              method: 'GET',
              headers: {
                'Authorization': authToken,
              },
            }
          );

          if (response.status === 200) {
            found.push(codigo);
            
            try {
              const analysisResponse = await fetch(
                `https://prodata.up.railway.app/solovivo/analise/buscar/${codigo}`,
                {
                  method: 'GET',
                  headers: {
                    'Authorization': authToken,
                  },
                }
              );

              if (analysisResponse.status === 200) {
                withAnalysis.push(codigo);
              } else {
                withoutAnalysis.push(codigo);
              }
            } catch (error) {
              console.error('Erro ao verificar análise:', error);
              withoutAnalysis.push(codigo);
            }
          } else {
            notFound.push(codigo);
          }
          
          setVerificationProgress(prev => ({
            ...prev,
            processed: prev.processed + 1,
          }));
          
        } catch (error) {
          console.error('Erro ao verificar amostra:', error);
          setVerificationProgress(prev => ({
            ...prev,
            processed: prev.processed + 1,
          }));
        }
      }
      
      setVerifiedSamples({ found, notFound, withAnalysis, withoutAnalysis });
      
      toast({
        title: "Verificação concluída",
        description: `${found.length} amostras encontradas (${withAnalysis.length} com análise, ${withoutAnalysis.length} sem análise) e ${notFound.length} não encontradas.`,
      });
      
    } catch (error) {
      console.error('Erro durante a verificação:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante a verificação das amostras.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setVerificationProgress({
        total: 0,
        processed: 0,
        currentSample: '',
      });
    }
  };

  const handleImport = async () => {
    if (activeTab === "amostras") {
      await verifySamples();
      return;
    }
    
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
      setFailedAnalyses([]);
      setImportProgress({
        total: data.length,
        processed: 0,
        success: 0,
        failed: 0,
      });

      const results = [];
      const newDuplicates: DuplicateItem[] = [];
      const newFailedAnalyses: string[] = [];
      
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

          let finalValues;
          try {
            if (activeTab === "analises") {
              finalValues = await adicionarDados(mappedValues);
              
              if (finalValues['id_produtor'] === null || finalValues['id_produtor'] === undefined) {
                newFailedAnalyses.push(code);
                setImportProgress(prev => ({
                  total: prev.total,
                  processed: prev.processed + 1,
                  success: prev.success,
                  failed: prev.failed + 1
                }));
                continue;
              }
            } else {
              finalValues = await adicionarDadosAmostra(mappedValues);
            }
          } catch (error) {
            console.error('Erro ao adicionar dados:', error);
            setImportProgress(prev => ({
              total: prev.total,
              processed: prev.processed + 1,
              success: prev.success,
              failed: prev.failed + 1
            }));
            break;
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
          break;
        }
      }

      setDuplicateItems(newDuplicates);
      setFailedAnalyses(newFailedAnalyses);
      const successCount = results.filter(r => r.success).length;
      
      if (newDuplicates.length > 0) {
        toast({
          title: `${newDuplicates.length} ${activeTab === 'analises' ? 'análises' : 'amostras'} já cadastradas`,
          description: `Os seguintes itens não foram inseridos pois já estão cadastrados: ${newDuplicates.map(item => item.codigo).join(', ')}`,
          variant: "destructive",
        });
      }

      if (newFailedAnalyses.length > 0) {
        toast({
          title: `${newFailedAnalyses.length} análises não cadastradas`,
          description: `As seguintes análises não foram cadastradas por não ter produtor associado: ${newFailedAnalyses.join(', ')}`,
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
    setFailedAnalyses([]);
    setVerifiedSamples({ found: [], notFound: [], withAnalysis: [], withoutAnalysis: [] });
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
        <h1 className="text-3xl font-bold mb-8 text-center">Importador - Dayane</h1>
        
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
      <h1 className="text-3xl font-bold mb-8 text-center">Importador - Dayane</h1>
      
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
                <TabsTrigger value="amostras">Verificar Amostras</TabsTrigger>
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
                        onValueChange={(value) => {
                          handleColumnMappingChange(field, value);
                          if (field === 'id_user') {
                            console.log(value);
                            setSelectedUserId(value);
                          } else if (field === 'cultura') {
                            console.log(value);
                            setSelectedCultura(value);
                          }
                        }}
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
                          ) : field === 'cultura' ? (
                            ['Forrageira'].map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))
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
                  Selecione a coluna da planilha que contém os códigos das amostras para verificar se já estão cadastradas e se possuem análises.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="field-codigo" className="text-sm font-medium">
                      Código da Amostra
                      <span className="text-xs text-red-500 ml-1">*</span>
                    </label>
                    <Select
                      value={columnMapping['codigo'] || "none"}
                      onValueChange={(value) => handleColumnMappingChange('codigo', value)}
                    >
                      <SelectTrigger id="field-codigo" className="w-full">
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
                </div>

                {isLoading && activeTab === "amostras" && (
                  <Card className="border-blue-200">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="flex items-center text-blue-700">
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Verificando Amostras
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progresso: {verificationProgress.processed} / {verificationProgress.total}</span>
                          <span>{Math.round((verificationProgress.processed / verificationProgress.total) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(verificationProgress.processed / verificationProgress.total) * 100} 
                          className="w-full h-3"
                        />
                      </div>
                      
                      {verificationProgress.currentSample && (
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Verificando amostra:</p>
                          <p className="font-medium text-blue-700">{verificationProgress.currentSample}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {importProgress.total > 0 && activeTab === "analises" && (
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
          
          {duplicateItems.length > 0 && activeTab === "analises" && (
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

          {failedAnalyses.length > 0 && activeTab === "analises" && (
            <div className="bg-white p-4 border rounded-lg border-red-500">
              <h3 className="text-lg font-medium mb-2 text-red-700">Análises não cadastradas</h3>
              <p className="text-sm text-gray-700 mb-2">
                As seguintes análises não foram cadastradas por não ter produtor associado:
              </p>
              <div className="flex flex-wrap gap-2">
                {failedAnalyses.map((codigo, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                    {codigo}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {(verifiedSamples.found.length > 0 || verifiedSamples.notFound.length > 0) && activeTab === "amostras" && (
            <div className="space-y-4">
              {verifiedSamples.found.length > 0 && (
                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center text-green-700">
                      <Check className="w-5 h-5 mr-2" />
                      Amostras Encontradas ({verifiedSamples.found.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {verifiedSamples.found.map((codigo, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {codigo}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {verifiedSamples.withAnalysis.length > 0 && (
                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center text-blue-700">
                      <Check className="w-5 h-5 mr-2" />
                      Amostras com Análises ({verifiedSamples.withAnalysis.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {verifiedSamples.withAnalysis.map((codigo, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {codigo}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {verifiedSamples.withoutAnalysis.length > 0 && (
                <Card>
                  <CardHeader className="bg-orange-50">
                    <CardTitle className="flex items-center text-orange-700">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Amostras sem Análises ({verifiedSamples.withoutAnalysis.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {verifiedSamples.withoutAnalysis.map((codigo, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                          {codigo}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {verifiedSamples.notFound.length > 0 && (
                <Card>
                  <CardHeader className="bg-amber-50">
                    <CardTitle className="flex items-center text-amber-700">
                      <List className="w-5 h-5 mr-2" />
                      Amostras Não Encontradas ({verifiedSamples.notFound.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {verifiedSamples.notFound.map((codigo, index) => (
                        <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                          {codigo}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {data.length} registros encontrados na planilha.
            </p>
            <Button
              onClick={activeTab === "amostras" ? verifySamples : handleImport}
              disabled={!areRequiredFieldsMapped() || (!selectedDate && activeTab === "analises") || isLoading}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              {isLoading 
                ? activeTab === "amostras" ? "Verificando..." : "Importando..." 
                : activeTab === "amostras" ? "Verificar Amostras" : "Importar Dados"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
