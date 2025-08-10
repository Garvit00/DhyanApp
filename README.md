Field names of document will be camel cased

Collection name will be Pascal Cased


# Dhyaan - Interactive 3D Meditation Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?style=flat-square&logo=React&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.166.1-black.svg?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.13.0-88CE02.svg?style=flat-square&logo=GreenSock&logoColor=white)](https://greensock.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10.0-FFCA28.svg?style=flat-square&logo=Firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg?style=flat-square&logo=Vite&logoColor=white)](https://vitejs.dev/)

> A cutting-edge meditation platform combining immersive 3D experiences with comprehensive wellness content. Built with React, Three.js, and Firebase.

🌐 **Live Demo**: [dhyanapp.epilepto.com](https://dhyanapp.epilepto.com)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

Dhyaan is an innovative meditation platform that combines modern web technologies to create an immersive wellness experience. The platform features:

- **Interactive 3D iPhone Model**: Showcasing the meditation app with realistic Three.js rendering
- **Scroll-Based Category Navigation**: Innovative scroll-lock system for exploring 5 meditation categories
- **Dynamic Content Management**: Firebase-powered blog system with 198+ meditation articles
- **Advanced Animations**: GSAP-powered smooth transitions and scroll interactions
- **Responsive Design**: Optimized for all devices from mobile to desktop

### 🧘‍♀️ Meditation Categories

1. **Meditation** - Mindfulness and guided meditation sessions
2. **Pranayama** - Breathing exercises and techniques
3. **Mantra** - Sacred sound and chanting practices
4. **Knowledge** - Educational content on meditation philosophy
5. **Yoga** - Physical postures and movement practices

## ✨ Features

### 🎮 Interactive 3D Experience
- **3D iPhone Model**: High-quality Three.js rendered iPhone with app mockups
- **Controlled Rotation**: Limited azimuth rotation with auto-reset functionality
- **Smooth Interactions**: GSAP-powered animations with damping effects

### 📜 Advanced Scroll Interactions
- **Scroll-Lock System**: Page stops scrolling when h1 reaches viewport top
- **Category Cycling**: Smooth transitions between 5 meditation categories
- **Progress Tracking**: Visual indicators showing exploration progress
- **Auto-Unlock**: Scrolling resumes after viewing all categories

### 📚 Content Management
- **Firebase Integration**: Real-time blog post management
- **Category Organization**: Content organized by meditation types
- **SEO Optimization**: Automated sitemap generation for 198+ articles
- **Responsive Blog Layout**: Optimized reading experience across devices

### 🎨 User Interface
- **Modern Design**: Clean, meditation-focused aesthetic
- **Hover Effects**: Enhanced card interactions with proper spacing
- **Responsive Navigation**: Adaptive navbar for all screen sizes
- **Testimonials**: Social proof with customer feedback

### 🔧 Technical Features
- **Environment Security**: Firebase credentials via environment variables
- **TypeScript**: Full type safety across the application
- **Performance Optimized**: Lazy loading and efficient rendering
- **SEO Ready**: Comprehensive meta tags and structured data

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with concurrent features
- **TypeScript 5.6.3** - Type-safe JavaScript development
- **Vite 6.3.5** - Fast build tool and development server
- **Tailwind CSS 4.x** - Utility-first CSS framework

### 3D & Animation
- **Three.js 0.166.1** - 3D graphics and WebGL rendering
- **React Three Fiber** - React renderer for Three.js
- **GSAP 3.13.0** - Professional animation library
- **ScrollTrigger** - Scroll-based animation plugin

### Backend & Database
- **Firebase 11.10.0** - Backend-as-a-Service platform
- **Firestore** - NoSQL document database
- **Firebase Hosting** - Static site hosting

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/apple-3js-main.git
cd apple-3js-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create environment file
cp .env.example .env.local

# Add your Firebase configuration (see Environment Variables section)
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
apple-3js-main/
├── public/                  # Static assets
│   ├── models/             # 3D models (.glb files)
│   ├── assets/images/      # Meditation category images
│   ├── videos/             # Demo videos
│   ├── fonts/              # Custom fonts
│   ├── robots.txt          # SEO crawler instructions
│   ├── sitemap.xml         # Generated sitemap
│   └── sitemap-generator.js # Sitemap generation script
├── src/
│   ├── components/         # React components
│   │   ├── Blog.tsx       # Blog listing with hover effects
│   │   ├── Features.tsx   # Scroll-lock category navigation
│   │   ├── HeroPhone.tsx  # 3D iPhone model component
│   │   ├── pages/         # Page components
│   │   └── ...
│   ├── constants/         # Application constants
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── animations.ts # GSAP animation helpers
│   │   └── getTime.ts    # Time formatting utilities
│   ├── firebase.ts       # Firebase configuration
│   └── main.tsx          # Application entry point
├── .env.local            # Environment variables (create manually)
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run format          # Format code with Prettier

# SEO & Content
npm run generate-sitemap # Generate sitemap from Firebase data
```

### Key Development Notes

#### 3D Model Integration
```typescript
// HeroPhone.tsx - 3D model with rotation limits
const controls = {
  minAzimuthAngle: -0.3,  // Limit left rotation
  maxAzimuthAngle: 0.3,   // Limit right rotation
  autoRotate: false,      // Disable auto-rotation
  enableDamping: true     // Smooth interactions
}
```

#### Scroll-Lock System
```typescript
// Features.tsx - Advanced scroll interaction
const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
  const entry = entries[0];
  if (entry.isIntersecting) {
    setIsScrollLocked(true);  // Lock page scrolling
    startCycling();           // Begin category cycling
  }
}, []);
```

#### Firebase Integration
```typescript
// firebase.ts - Environment-based configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Sitemap Generation (Node.js environment)
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_API_KEY=your_api_key_here
```

**Security Note**: Never commit `.env.local` to version control. All Firebase credentials are loaded from environment variables for security.

## 🚀 Deployment

### Automatic Deployment
The project is configured for deployment on Vercel/Netlify with automatic builds from the main branch.

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

### Post-Deployment
1. **Generate Sitemap**: Run `npm run generate-sitemap` to update SEO files
2. **Verify Environment Variables**: Ensure all Firebase variables are set in production
3. **Test 3D Models**: Verify Three.js models load correctly
4. **Check Scroll Interactions**: Test the Features component scroll-lock system

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Test on multiple devices/browsers

## 📝 Documentation

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [Architecture Overview](ARCHITECTURE.md) - Technical architecture details
- [API Documentation](API.md) - Firebase integration and data structures

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1.5s
- **3D Model Loading**: Optimized .glb files for fast loading
- **Image Optimization**: WebP format with fallbacks

## 🐛 Troubleshooting

### Common Issues

**3D Model Not Loading**
- Check browser WebGL support
- Verify model files in `public/models/`
- Check console for Three.js errors

**Firebase Connection Issues**
- Verify environment variables are set
- Check Firebase project configuration
- Ensure Firestore rules allow read access

**Scroll Interactions Not Working**
- Check GSAP ScrollTrigger initialization
- Verify intersection observer setup
- Test on different devices/browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for 3D graphics
- [GSAP](https://greensock.com/) for animations
- [Firebase](https://firebase.google.com/) for backend services
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React integration

---