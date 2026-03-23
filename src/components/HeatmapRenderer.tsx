interface HeatmapRendererProps {
  config: string;
}

const HeatmapRenderer = ({ config }: HeatmapRendererProps) => {
  try {
    const heatmapConfig = JSON.parse(config);
    const { data, xLabels, yLabels, title, colorScheme = 'blue', showValues = true } = heatmapConfig;

    // Validação
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Data deve ser um array 2D não vazio');
    }

    // Encontrar valores min e max para normalização
    const flatData = data.flat();
    const minValue = Math.min(...flatData);
    const maxValue = Math.max(...flatData);

    // Esquemas de cores
    const colorSchemes: Record<string, { low: string; high: string }> = {
      blue: { low: '#eff6ff', high: '#1e40af' },
      green: { low: '#f0fdf4', high: '#15803d' },
      red: { low: '#fef2f2', high: '#b91c1c' },
      purple: { low: '#faf5ff', high: '#7e22ce' },
      orange: { low: '#fff7ed', high: '#c2410c' },
      viridis: { low: '#fde725', high: '#440154' },
    };

    const colors = colorSchemes[colorScheme] || colorSchemes.blue;

    // Função para gerar cor baseada no valor
    const getColor = (value: number) => {
      const normalized = (value - minValue) / (maxValue - minValue || 1);
      
      const parseColor = (hex: string) => ({
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
      });

      const low = parseColor(colors.low);
      const high = parseColor(colors.high);

      const r = Math.round(low.r + (high.r - low.r) * normalized);
      const g = Math.round(low.g + (high.g - low.g) * normalized);
      const b = Math.round(low.b + (high.b - low.b) * normalized);

      return `rgb(${r}, ${g}, ${b})`;
    };

    const rows = data.length;
    const cols = data[0].length;
    const cellSize = 70;

    return (
      <div className="my-6 bg-white dark:bg-slate-50 rounded-lg p-8 shadow-md">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">{title}</h3>
        )}
        
        <div className="flex justify-center overflow-x-auto">
          <div className="inline-block">
            {/* Grid Container */}
            <div className="grid gap-0" style={{ 
              gridTemplateColumns: `auto repeat(${cols}, ${cellSize}px)`,
              gridTemplateRows: `auto repeat(${rows}, ${cellSize}px)`,
            }}>
              {/* Célula vazia no canto superior esquerdo */}
              <div></div>
              
              {/* Labels das colunas (topo) */}
              {(xLabels || Array.from({ length: cols }, (_, i) => `C${i + 1}`)).map((label, i) => (
                <div 
                  key={`xlabel-${i}`}
                  className="flex items-center justify-center text-sm font-medium text-gray-700 pb-2"
                >
                  {label}
                </div>
              ))}

              {/* Linhas da matriz */}
              {data.map((row, rowIndex) => (
                <>
                  {/* Label da linha (esquerda) */}
                  <div 
                    key={`ylabel-${rowIndex}`}
                    className="flex items-center justify-end pr-3 text-sm font-medium text-gray-700"
                  >
                    {(yLabels || Array.from({ length: rows }, (_, i) => `R${i + 1}`))[rowIndex]}
                  </div>
                  
                  {/* Células da linha */}
                  {row.map((value, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="relative border border-gray-200 flex items-center justify-center"
                      style={{ backgroundColor: getColor(value) }}
                    >
                      {showValues && (
                        <span 
                          className="text-xs font-semibold pointer-events-none"
                          style={{ 
                            color: (value - minValue) / (maxValue - minValue) > 0.5 ? 'white' : '#1f2937'
                          }}
                        >
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </span>
                      )}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Legenda de cores */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-sm text-gray-700 font-medium">{minValue.toFixed(2)}</span>
          <div className="flex shadow-sm rounded overflow-hidden border border-gray-200">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-6"
                style={{
                  backgroundColor: getColor(minValue + (maxValue - minValue) * (i / 29)),
                }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-700 font-medium">{maxValue.toFixed(2)}</span>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="my-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <p className="text-sm font-semibold text-destructive mb-2">Erro ao renderizar heatmap:</p>
        <p className="text-xs text-muted-foreground mb-3">{error.message}</p>
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            Ver formato esperado
          </summary>
          <pre className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-x-auto">
{`\`\`\`heatmap
{
  "data": [
    [0.2, 0.5, 0.8],
    [0.4, 0.7, 0.3],
    [0.9, 0.1, 0.6]
  ],
  "xLabels": ["Col1", "Col2", "Col3"],
  "yLabels": ["Row1", "Row2", "Row3"],
  "title": "Matriz de Correlação",
  "colorScheme": "blue",
  "showValues": true
}
\`\`\`

Esquemas de cores: blue, green, red, purple, orange, viridis`}
          </pre>
        </details>
      </div>
    );
  }
};

export default HeatmapRenderer;
