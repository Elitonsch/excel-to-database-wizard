
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Import, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileLoaded: (data: any[], headers: string[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          toast({
            title: "Erro",
            description: "A planilha está vazia ou não contém dados válidos.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        const headers = Object.keys(jsonData[0] || {});
        
        onFileLoaded(jsonData, headers);
        toast({
          title: "Sucesso",
          description: `Planilha carregada com sucesso: ${jsonData.length} registros encontrados.`,
        });
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: "Erro",
          description: "Não foi possível ler a planilha. Verifique o formato do arquivo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: "Erro",
        description: "Erro ao ler o arquivo.",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  }, [onFileLoaded, toast]);

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-4" />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button 
          variant="outline" 
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Upload className="w-4 h-4 animate-pulse" />
              Carregando...
            </>
          ) : (
            <>
              <Import className="w-4 h-4" />
              Selecionar Planilha
            </>
          )}
        </Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          onClick={(e) => {
            // Resetar o valor para permitir selecionar o mesmo arquivo novamente
            (e.target as HTMLInputElement).value = '';
          }}
        />
      </label>
      <p className="mt-2 text-sm text-gray-500">Arquivos suportados: .xlsx, .xls</p>
    </div>
  );
};

export default FileUpload;
