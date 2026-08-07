'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChefHat, TrendingUp, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          {/* Wave 1 - Bottom */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#6D28D9', stopOpacity: 0.1 }} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#A78BFA', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>

          {/* Wave 1 */}
          <path
            d="M0,300 Q300,250 600,300 T1200,300 L1200,600 L0,600 Z"
            fill="url(#grad1)"
            className="animate-wave1"
          />

          {/* Wave 2 */}
          <path
            d="M0,350 Q300,300 600,350 T1200,350 L1200,600 L0,600 Z"
            fill="url(#grad2)"
            className="animate-wave2"
          />

          {/* Wave 3 */}
          <path
            d="M0,400 Q300,350 600,400 T1200,400 L1200,600 L0,600 Z"
            fill="url(#grad1)"
            className="animate-wave3"
            opacity="0.5"
          />
        </svg>

        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-600 rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-violet-400">
              RXSAAS
            </span>
          </div>

          <Link
            href="/admin"
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Entrar
          </Link>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Gestão Completa de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-400 to-purple-300">
                Restaurante
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
              Sistema inteligente para controlar cardápio, estoque, pedidos, clientes e equipe.
              Tudo em um único lugar.
            </p>

            {/* CTA Button */}
            <Link
              href="/admin"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="inline-block px-8 md:px-12 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 mb-12"
            >
              Começar Agora
            </Link>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
              {[
                {
                  icon: ChefHat,
                  title: 'Cardápio',
                  description: 'Organize seus produtos com variações e fichas técnicas',
                },
                {
                  icon: Zap,
                  title: 'Pedidos',
                  description: 'Gerencie salão, delivery e balcão em um painel',
                },
                {
                  icon: TrendingUp,
                  title: 'Análises',
                  description: 'Controle financeiro e previsões inteligentes',
                },
                {
                  icon: Users,
                  title: 'Equipe',
                  description: 'Escalas, folha de pagamento e RH integrado',
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-purple-400/20 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <Icon className="w-12 h-12 text-purple-300 mb-4 group-hover:text-purple-200 transition-colors" />
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-purple-100">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-purple-200/60 text-sm">
          <p>© 2026 RXSAAS. Sistema de gestão de restaurantes.</p>
        </footer>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes wave1 {
          0%, 100% {
            d: path('M0,300 Q300,250 600,300 T1200,300 L1200,600 L0,600 Z');
          }
          50% {
            d: path('M0,280 Q300,230 600,280 T1200,280 L1200,600 L0,600 Z');
          }
        }

        @keyframes wave2 {
          0%, 100% {
            d: path('M0,350 Q300,300 600,350 T1200,350 L1200,600 L0,600 Z');
          }
          50% {
            d: path('M0,330 Q300,280 600,330 T1200,330 L1200,600 L0,600 Z');
          }
        }

        @keyframes wave3 {
          0%, 100% {
            d: path('M0,400 Q300,350 600,400 T1200,400 L1200,600 L0,600 Z');
          }
          50% {
            d: path('M0,380 Q300,330 600,380 T1200,380 L1200,600 L0,600 Z');
          }
        }

        .animate-wave1 {
          animation: wave1 8s ease-in-out infinite;
        }

        .animate-wave2 {
          animation: wave2 10s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-wave3 {
          animation: wave3 12s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
