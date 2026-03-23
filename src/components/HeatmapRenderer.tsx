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
    const cellSize = 60;
    const padding = 80;
    const svgWidth = cols * cellSize + padding * 2;
    const svgHeight = rows * cellSize + padding * 2;

    return (
      <div className="my-6 flex flex-col items-center">
        {title && (
          <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        )}
        <div className="overflow-x-auto w-full flex justify-center">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="bg-card rounded-lg shadow-sm"
            style={{ minWidth: '400px' }}
          >
            {/* Grid de células */}
            {data.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <g key={`cell-${rowIndex}-${colIndex}`}>
                  <rect
                    x={padding + colIndex * cellSize}
                    y={padding + rowIndex * cellSize}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    fill={getColor(value, colorScheme)}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    className="transition-opacity hover:opacity-80"
                  />
                  {(showValues !== false) && (
                    <text
                      x={padding + colIndex * cellSize + cellSize / 2}
                      y={padding + rowIndex * cellSize + cellSize / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-medium pointer-events-none"
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
                  y={padding - 10}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {label}
                </text>
              ))}

            {/* Labels do eixo Y */}
            {yLabels &&
              yLabels.map((label: string, index: number) => (
                <text
                  key={`y-label-${index}`}
                  x={padding - 10}
                  y={padding + index * cellSize + cellSize / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {label}
                </text>
              ))}

            {/* Legenda de cores */}
            <g transform={`translate(${padding}, ${padding + rows * cellSize + 40})`}>
              <text x="0" y="-5" className="text-xs fill-muted-foreground">
                {minValue.toFixed(2)}
              </text>
              {Array.from({ length: 10 }).map((_, i) => (
                <rect
                  key={`legend-${i}`}
                  x={i * 20}
                  y="0"
                  width="20"
                  height="15"
                  fill={getColor(minValue + (maxValue - minValue) * (i / 9), colorScheme)}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                />
              ))}
              <text x="200" y="-5" className="text-xs fill-muted-foreground">
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
