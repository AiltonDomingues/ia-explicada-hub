import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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
      blue: { low: '#e0f2fe', high: '#0369a1' },
      green: { low: '#d1fae5', high: '#047857' },
      red: { low: '#fee2e2', high: '#dc2626' },
      purple: { low: '#f3e8ff', high: '#7c3aed' },
      orange: { low: '#ffedd5', high: '#ea580c' },
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

    // Transformar dados para formato Recharts
    const cols = data[0].length;
    const chartData = data.map((row, rowIndex) => {
      const rowData: any = {
        name: yLabels?.[rowIndex] || `Row ${rowIndex + 1}`,
      };
      row.forEach((value, colIndex) => {
        const colName = xLabels?.[colIndex] || `Col ${colIndex + 1}`;
        rowData[colName] = value;
      });
      return rowData;
    });

    // Obter nomes das colunas
    const columnNames = xLabels || Array.from({ length: cols }, (_, i) => `Col ${i + 1}`);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold text-gray-900 mb-1">{payload[0].payload.name}</p>
            <p className="text-sm text-gray-700">
              {payload[0].name}: <span className="font-medium">{payload[0].value.toFixed(3)}</span>
            </p>
          </div>
        );
      }
      return null;
    };

    // Custom label para mostrar valores nas células
    const CustomLabel = (props: any) => {
      const { x, y, width, height, value } = props;
      if (!showValues) return null;
      
      return (
        <text
          x={x + width / 2}
          y={y + height / 2}
          fill={(value - minValue) / (maxValue - minValue) > 0.5 ? 'white' : '#1f2937'}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-semibold"
        >
          {typeof value === 'number' ? value.toFixed(2) : value}
        </text>
      );
    };

    const barHeight = Math.max(60, Math.min(100, 600 / data.length));

    return (
      <div className="my-6 bg-white dark:bg-slate-50 rounded-lg p-6 shadow-md">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
        )}
        
        <ResponsiveContainer width="100%" height={Math.max(300, data.length * barHeight + 100)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="name" type="category" stroke="#6b7280" width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {columnNames.map((colName, index) => (
              <Bar key={colName} dataKey={colName} stackId="a" label={<CustomLabel />}>
                {chartData.map((entry, rowIndex) => (
                  <Cell key={`cell-${rowIndex}-${index}`} fill={getColor(entry[colName])} />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* Legenda de cores */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-600">{minValue.toFixed(2)}</span>
          <div className="flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4"
                style={{
                  backgroundColor: getColor(minValue + (maxValue - minValue) * (i / 19)),
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">{maxValue.toFixed(2)}</span>
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
