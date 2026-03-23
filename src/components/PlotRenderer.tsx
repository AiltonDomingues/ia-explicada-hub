import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PlotRendererProps {
  config: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const TOOLTIP_STYLE = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  color: '#1f2937',
};

const PlotRenderer = ({ config }: PlotRendererProps) => {
  try {
    const plotConfig = JSON.parse(config);
    const { type, data, xKey, yKey, title, width, height } = plotConfig;

    const chartWidth = width || '100%';
    const chartHeight = height || 400;

    const renderChart = () => {
      switch (type?.toLowerCase()) {
        case 'line':
          return (
            <ResponsiveContainer width={chartWidth} height={chartHeight}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey={xKey || 'x'} className="text-xs" stroke="#6b7280" />
                <YAxis className="text-xs" stroke="#6b7280" />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                {Object.keys(data[0] || {})
                  .filter((key) => key !== (xKey || 'x'))
                  .map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          );

        case 'bar':
          return (
            <ResponsiveContainer width={chartWidth} height={chartHeight}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey={xKey || 'x'} className="text-xs" stroke="#6b7280" />
                <YAxis className="text-xs" stroke="#6b7280" />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                {Object.keys(data[0] || {})
                  .filter((key) => key !== (xKey || 'x'))
                  .map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          );

        case 'scatter':
          return (
            <ResponsiveContainer width={chartWidth} height={chartHeight}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey={xKey || 'x'} type="number" className="text-xs" stroke="#6b7280" />
                <YAxis dataKey={yKey || 'y'} type="number" className="text-xs" stroke="#6b7280" />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Legend />
                <Scatter
                  name="Data"
                  data={data}
                  fill={COLORS[0]}
                />
              </ScatterChart>
            </ResponsiveContainer>
          );

        case 'area':
          return (
            <ResponsiveContainer width={chartWidth} height={chartHeight}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey={xKey || 'x'} className="text-xs" stroke="#6b7280" />
                <YAxis className="text-xs" stroke="#6b7280" />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                {Object.keys(data[0] || {})
                  .filter((key) => key !== (xKey || 'x'))
                  .map((key, index) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stackId="1"
                      stroke={COLORS[index % COLORS.length]}
                      fill={COLORS[index % COLORS.length]}
                      fillOpacity={0.6}
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          );

        case 'pie':
          return (
            <ResponsiveContainer width={chartWidth} height={chartHeight}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey={yKey || 'value'}
                  nameKey={xKey || 'name'}
                >
                  {data.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          );

        default:
          return (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-4 rounded-lg">
              <p className="font-semibold">Tipo de gráfico não suportado: {type}</p>
              <p className="text-sm mt-1">Tipos disponíveis: line, bar, scatter, area, pie</p>
            </div>
          );
      }
    };

    return (
      <div className="my-6 bg-white dark:bg-slate-50 rounded-lg p-6 shadow-md">
        {title && (
          <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">
            {title}
          </h4>
        )}
        <div className="overflow-auto">
          {renderChart()}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="my-6 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
        <p className="font-semibold mb-1">Erro ao renderizar gráfico</p>
        <pre className="text-xs overflow-auto mt-2 bg-background/50 p-2 rounded">
          {error instanceof Error ? error.message : 'JSON inválido'}
        </pre>
        <p className="text-xs mt-2">
          Exemplo de formato válido:
        </p>
        <pre className="text-xs overflow-auto mt-1 bg-background/50 p-2 rounded">
{`{
  "type": "line",
  "data": [
    {"x": "A", "y": 10},
    {"x": "B", "y": 20}
  ],
  "title": "Meu Gráfico"
}`}
        </pre>
      </div>
    );
  }
};

export default PlotRenderer;
