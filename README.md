# New Zealand Financial Analytics Platform - Frontend

A modern, AWS-style financial analytics platform frontend built with React, TypeScript, and Vite. Features a dynamic, tech-forward UI with a purple color scheme and smooth animations.

## 🎨 Design Features

- **AWS-Inspired Design**: Dark theme with purple gradient accents
- **Dynamic UI**: Smooth animations and transitions throughout
- **Responsive Layout**: Fully responsive design for desktop and mobile
- **Modern Tech Stack**: React 18 + TypeScript + Vite

## 🛠️ Technology Stack

- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing
- **Recharts**: Beautiful chart visualizations
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API calls

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Layout.tsx      # Main layout with navigation
│   │   ├── KPICard.tsx     # KPI display cards
│   │   ├── TrendChart.tsx  # Chart components
│   │   └── PrivateRoute.tsx # Route protection
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx  # Authentication state
│   ├── pages/              # Page components
│   │   ├── Login.tsx       # Login page
│   │   ├── Register.tsx   # Registration page
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── Upload.tsx      # File upload page
│   │   ├── Reports.tsx     # Reports and analytics
│   │   └── Settings.tsx     # Settings page
│   ├── services/           # API service layer
│   │   └── api.ts          # API client
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env if needed (default should work for local development)
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Color Palette

- **Primary Purple**: `#7B2FF7`
- **Secondary Purple**: `#9333EA`
- **Light Purple**: `#A855F7`
- **Dark Background**: `#0f1419`
- **Card Background**: `#1a1f2e`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#b4bcd0`

### Key Design Elements

- **Glassmorphism**: Cards use backdrop blur and transparency
- **Gradient Accents**: Purple gradients for headings and highlights
- **Smooth Animations**: Fade-in, slide-up, and hover effects
- **Glowing Borders**: Subtle purple glow on interactive elements

## 📱 Pages

- **Login/Register**: Authentication pages with animated backgrounds
- **Dashboard**: Overview with KPIs, trends, and financial ratios
- **Upload**: File upload interface with drag-and-drop styling
- **Reports**: Detailed reports with interactive charts and filters
- **Settings**: Company management interface

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Vite Configuration

The project uses Vite with React plugin. Proxy configuration is set up in `vite.config.ts` to forward API requests to the backend.

## 🎯 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark mode with purple accents
- **Smooth Animations**: Page transitions and hover effects
- **Interactive Charts**: Recharts integration for data visualization
- **Type Safety**: Full TypeScript support
- **Modern UI**: AWS-inspired design with glassmorphism effects

## 📝 Development Notes

### API Integration

The frontend is designed to work with a backend API. Update the `VITE_API_BASE_URL` in your `.env` file to point to your backend server.

### Mock Data

For development without a backend, you can modify the API service layer to return mock data.

### Styling

All styles use CSS variables defined in `index.css` for easy theming. The design follows AWS Console patterns with:
- Dark backgrounds
- Purple gradient accents
- Glassmorphism effects
- Smooth animations

## 🚀 Deployment

### Static Hosting

Build the project and deploy the `dist` folder to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3 + CloudFront**: Upload `dist` to S3 bucket
- **GitHub Pages**: Use GitHub Actions to deploy

### Environment Variables

Make sure to set `VITE_API_BASE_URL` in your hosting platform's environment variables.

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)
- [Recharts Documentation](https://recharts.org)

## 🎨 Design Inspiration

This frontend is inspired by AWS Console's design language:
- Dark theme with purple accents
- Clean, modern interface
- Smooth animations and transitions
- Professional, tech-forward aesthetic

---
## 🎥 Demo Video
https://github.com/edison1006/New-Zealand-Financial-Analysis-Model/blob/main/Demo.mov
**Built with ❤️ for New Zealand businesses**
