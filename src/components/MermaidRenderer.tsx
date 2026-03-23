import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
}

const MermaidRenderer = ({ chart }: MermaidRendererProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Configurar Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#2563eb',
        lineColor: '#6b7280',
        secondaryColor: '#10b981',
        tertiaryColor: '#f59e0b',
      },
    });

    const renderChart = async () => {
      if (elementRef.current) {
        try {
          // Limpar conteúdo anterior
          elementRef.current.innerHTML = '';
          
          // Renderizar novo diagrama
          const { svg } = await mermaid.render(idRef.current, chart);
          elementRef.current.innerHTML = svg;

          const svgElement = elementRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.display = 'block';
            svgElement.style.maxWidth = '100%';
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          }
        } catch (error) {
          console.error('Erro ao renderizar Mermaid:', error);
          elementRef.current.innerHTML = `
            <div class="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
              <p class="font-semibold mb-1">Erro ao renderizar diagrama Mermaid</p>
              <pre class="text-xs overflow-auto">${error instanceof Error ? error.message : 'Erro desconhecido'}</pre>
            </div>
          `;
        }
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div className="my-6 w-full">
      <div 
        ref={elementRef} 
        className="mermaid-diagram w-full bg-white dark:bg-slate-50 p-6 rounded-lg shadow-md overflow-auto"
      />
    </div>
  );
};

export default MermaidRenderer;
