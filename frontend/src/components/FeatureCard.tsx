import { ReactNode } from 'react'
import './FeatureCard.css'

interface FeatureCardProps {
  title: string
  items: string[]
  icon?: ReactNode
  onClick?: () => void
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, items, icon, onClick }) => {
  return (
    <div className="feature-card" onClick={onClick}>
      <div className="feature-card-header">
        {icon && <div className="feature-icon">{icon}</div>}
        <h3 className="feature-title">{title}</h3>
      </div>
      <ul className="feature-items">
        {items.map((item, index) => (
          <li key={index} className="feature-item">
            {item}
          </li>
        ))}
      </ul>
      <div className="feature-card-overlay"></div>
    </div>
  )
}

export default FeatureCard


