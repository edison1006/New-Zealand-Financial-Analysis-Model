import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendDataPoint } from '../types'
import './TrendChart.css'

interface TrendChartProps {
  data: TrendDataPoint[]
  title: string
}

const TrendChart: React.FC<TrendChartProps> = ({ data, title }) => {
  const chartData = data.map((point) => ({
    period: point.period,
    Revenue: Number(point.revenue),
    Expenses: Number(point.expenses),
    'Net Income': Number(point.net_income),
    'Cash Flow': Number(point.cash_flow),
  }))

  return (
    <div className="trend-chart">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Legend />
          <Line type="monotone" dataKey="Revenue" stroke="#3498db" strokeWidth={2} />
          <Line type="monotone" dataKey="Expenses" stroke="#e74c3c" strokeWidth={2} />
          <Line type="monotone" dataKey="Net Income" stroke="#2ecc71" strokeWidth={2} />
          <Line type="monotone" dataKey="Cash Flow" stroke="#f39c12" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendChart

