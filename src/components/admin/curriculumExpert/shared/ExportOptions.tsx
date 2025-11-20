import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileJson, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  content: any;
  filename: string;
}

export const ExportOptions = ({ content, filename }: ExportOptionsProps) => {
  const { toast } = useToast();

  const exportJSON = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exported',
      description: 'Content exported as JSON.'
    });
  };

  const copyToClipboard = () => {
    const dataStr = JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(dataStr);
    
    toast({
      title: 'Copied',
      description: 'Content copied to clipboard.'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Download JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
