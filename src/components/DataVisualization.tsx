import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

interface DataVisualizationProps {
  config: {
    type: 'line' | 'bar' | 'pie' | 'table' | 'kpi';
    data: any;
    options: Record<string, any>;
    title: string;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DataVisualization: React.FC<DataVisualizationProps> = ({ config }) => {
  const renderKPI = () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {Object.entries(config.data).map(([key, value]: [string, any], index: number) => (
        <Card key={index} sx={{ minWidth: 120, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {Object.keys(config.data[0] || {}).map((header) => (
              <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {config.data.map((row: any, index: number) => (
            <TableRow key={index}>
              {Object.values(row).map((cell: any, cellIndex: number) => (
                <TableCell key={cellIndex}>
                  {typeof cell === 'number' ? cell.toLocaleString() : cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderChart = () => {
    const { type, data, options } = config;

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={options.xAxis} />
              <YAxis />
              <Tooltip formatter={(value: any) => 
                options.format === 'currency' ? `$${value.toLocaleString()}` : value
              } />
              <Legend />
              <Bar dataKey={options.yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={options.xAxis} />
              <YAxis />
              <Tooltip formatter={(value: any) => 
                options.format === 'currency' ? `$${value.toLocaleString()}` : value
              } />
              <Legend />
              {Array.isArray(options.yAxis) ? (
                options.yAxis.map((key: string, index: number) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={options.yAxis}
                  stroke="#8884d8"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={options.dataKey || 'value'}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => 
                options.format === 'currency' ? `$${value.toLocaleString()}` : value
              } />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {config.title}
        </Typography>
        
        {config.type === 'kpi' && renderKPI()}
        {config.type === 'table' && renderTable()}
        {(config.type === 'bar' || config.type === 'line' || config.type === 'pie') && renderChart()}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
