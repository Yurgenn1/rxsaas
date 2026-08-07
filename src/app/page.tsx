'use client';

import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden flex flex-col">
      {/* Animated DNA Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full opacity-20 animate-rotate-slow"
          viewBox="0 0 400 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="dna-grad-1" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="dna-grad-2" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="dna-grad-3" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0891B2" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="dna-grad-4" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* DNA Helix 1 - Cardápio (Purple) */}
          <path d="M 150 50 Q 120 100 150 150 T 150 250 T 150 350 T 150 450 T 150 550" stroke="url(#dna-grad-1)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 250 50 Q 280 100 250 150 T 250 250 T 250 350 T 250 450 T 250 550" stroke="url(#dna-grad-1)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />

          {/* DNA Helix 2 - Pedidos (Pink) */}
          <path d="M 160 100 Q 190 130 160 160 T 160 260 T 160 360 T 160 460 T 160 560" stroke="url(#dna-grad-2)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.9" />
          <path d="M 240 100 Q 210 130 240 160 T 240 260 T 240 360 T 240 460 T 240 560" stroke="url(#dna-grad-2)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5" />

          {/* DNA Helix 3 - Delivery (Cyan) */}
          <path d="M 170 120 Q 140 160 170 200 T 170 300 T 170 400 T 170 500" stroke="url(#dna-grad-3)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M 230 120 Q 260 160 230 200 T 230 300 T 230 400 T 230 500" stroke="url(#dna-grad-3)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.4" />

          {/* DNA Helix 4 - Estoque (Green) */}
          <path d="M 180 140 Q 210 180 180 220 T 180 320 T 180 420" stroke="url(#dna-grad-4)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M 220 140 Q 190 180 220 220 T 220 320 T 220 420" stroke="url(#dna-grad-4)" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.3" />

          {/* Connection strands */}
          <line x1="150" y1="75" x2="250" y2="75" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" />
          <line x1="160" y1="175" x2="240" y2="175" stroke="#EC4899" strokeWidth="2" opacity="0.4" />
          <line x1="170" y1="275" x2="230" y2="275" stroke="#06B6D4" strokeWidth="2" opacity="0.4" />
          <line x1="180" y1="375" x2="220" y2="375" stroke="#10B981" strokeWidth="2" opacity="0.4" />
        </svg>

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-widest">Sistema de Gestão</p>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-300 to-cyan-300">
              RXSAAS
            </span>
          </div>
        </div>

        <Link
          href="/admin"
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
        >
          Entrar
        </Link>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 pb-12">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            O DNA do seu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-cyan-300">
              Restaurante
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Controle total de cardápio, pedidos, estoque, delivery, equipe e financeiro.
            Um único sistema para toda a operação do seu negócio.
          </p>

          <Link
            href="/admin"
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 mb-12"
          >
            Começar Agora →
          </Link>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {['Cardápio', 'Pedidos', 'Estoque', 'Delivery', 'Clientes', 'Equipe', 'Financeiro', 'Análises'].map((feature, idx) => (
              <div
                key={idx}
                className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 hover:bg-white/10 transition-all duration-300 group cursor-default"
              >
                <p className="text-sm font-semibold text-purple-200 group-hover:text-white transition-colors">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-slate-500 text-sm border-t border-slate-800">
        <p>© 2026 RXSAAS — Gestão Inteligente de Restaurantes</p>
      </footer>

      <style>{`
        @keyframes rotateSlow {
          from {
            transform: rotate(0deg) scale(1.2);
          }
          to {
            transform: rotate(360deg) scale(1.2);
          }
        }

        .animate-rotate-slow {
          animation: rotateSlow 20s linear infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
