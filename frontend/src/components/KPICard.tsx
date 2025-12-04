import './KPICard.css'

interface KPICardProps {
  title: string
  value: string | number
  trend?: string
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend }) => {
  return (
    <div className="kpi-card">
      <h3 className="kpi-title">{title}</h3>
      <p className="kpi-value">{value}</p>
      {trend && (
        <span className={`kpi-trend ${trend}`}>
          {trend === 'improving' ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
  )
}

export default KPICard

