interface HeatmapRendererProps {
  config: string;
}

const HeatmapRenderer = ({ config }: HeatmapRendererProps) => {
  try {
    const heatmapConfig = JSON.parse(config);
    const { data, xLabels, yLabels, title, colorScheme, showValues } = heatmapConfig;

    // Validação
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Data deve ser um array 2D não vazio');
    }

    // Encontrar valores min e max para normalização
    const flatData = data.flat();
    const minValue = Math.min(...flatData);
    const maxValue = Math.max(...flatData);

    // Função para gerar cor baseada no valor
    const getColor = (value: number, scheme: string = 'blue') => {
      const normalized = (value - minValue) / (maxValue - minValue || 1);
      
      const schemes: Record<string, { low: string; high: string }> = {
        blue: { low: '#e0f2fe', high: '#0369a1' },
        green: { low: '#d1fae5', high: '#047857' },
        red: { low: '#fee2e2', high: '#dc2626' },
        purple: { low: '#f3e8ff', high: '#7c3aed' },
        orange: { low: '#ffedd5', high: '#ea580c' },
        viridis: { low: '#fde725', high: '#440154' },
      };

      const colors = schemes[scheme] || schemes.blue;
      
      // Interpolação RGB
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
    const cellSize = 100;
    const padding = 120;
    const svgWidth = cols * cellSize + padding * 2;
    const svgHeight = rows * cellSize + padding * 2;

    return (
      <div className="my-8 flex flex-col items-center w-full">
        {title && (
          <h3 className="text-xl font-semibold text-foreground mb-6">{title}</h3>
        )}
        <div className="overflow-x-auto w-full flex justify-center px-4 py-6 bg-background rounded-lg">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="bg-white dark:bg-slate-50 rounded-lg shadow-lg"
          >
            {/* Grid de células */}
            {data.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <g key={`cell-${rowIndex}-${colIndex}`}>
                  <rect
                    x={padding + colIndex * cellSize}
                    y={padding + rowIndex * cellSize}
                    width={cellSize - 4}
                    height={cellSize - 4}
                    fill={getColor(value, colorScheme)}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    className="transition-opacity hover:opacity-80 cursor-pointer"
                  />
                  {(showValues !== false) && (
                    <text
                      x={padding + colIndex * cellSize + cellSize / 2}
                      y={padding + rowIndex * cellSize + cellSize / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm font-semibold pointer-events-none"
                      fill={
                        (value - minValue) / (maxValue - minValue) > 0.5
                          ? 'white'
                          : 'hsl(var(--foreground))'
                      }
                    >
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </text>
                  )}
                </g>
              ))
            )}

            {/* Labels do eixo X */}
            {xLabels &&
              xLabels.map((label: string, index: number) => (
                <text
                  key={`x-label-${index}`}
                  x={padding + index * cellSize + cellSize / 2}
                  y={padding - 15}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700"
                >
                  {label}
                </text>
              ))}

            {/* Labels do eixo Y */}
            {yLabels &&
              yLabels.map((label: string, index: number) => (
                <text
                  key={`y-label-${index}`}
                  x={padding - 15}
                  y={padding + index * cellSize + cellSize / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-sm font-medium fill-gray-700"
                >
                  {label}
                </text>
              ))}

            {/* Legenda de cores */}
            <g transform={`translate(${padding}, ${padding + rows * cellSize + 50})`}>
              <text x="0" y="-8" className="text-sm font-medium fill-gray-700">
                {minValue.toFixed(2)}
              </text>
              {Array.from({ length: 15 }).map((_, i) => (
                <rect
                  key={`legend-${i}`}
                  x={i * 30}
                  y="0"
                  width="30"
                  height="20"
                  fill={getColor(minValue + (maxValue - minValue) * (i / 14), colorScheme)}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              ))}
              <text x="450" y="-8" className="text-sm font-medium fill-gray-700">
                {maxValue.toFixed(2)}
              </text>
            </g>
          </svg>
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
