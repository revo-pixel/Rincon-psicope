import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Sparkles, Heart, BookOpen } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
  };

  useGSAP(() => {
    // Blobs flotantes suaves (reemplaza el animate-pulse de CSS)
    gsap.to(blob1Ref.current, {
      x: 30, y: -20, scale: 1.1,
      duration: 4, ease: 'sine.inOut',
      yoyo: true, repeat: -1,
    });
    gsap.to(blob2Ref.current, {
      x: -25, y: 30, scale: 0.95,
      duration: 5, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 1,
    });
    gsap.to(blob3Ref.current, {
      x: 20, y: 15, scale: 1.05,
      duration: 4.5, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 0.5,
    });

    // Animación de entrada en secuencia
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('[data-hero="badge"]',     { autoAlpha: 0, y: -20, duration: 0.6 })
      .from('[data-hero="title"]',     { autoAlpha: 0, y: 40,  duration: 0.7 }, '-=0.2')
      .from('[data-hero="subtitle"]',  { autoAlpha: 0, y: 30,  duration: 0.6 }, '-=0.3')
      .from('[data-hero="cta"] > *',   { autoAlpha: 0, y: 20,  duration: 0.5, stagger: 0.15 }, '-=0.2')
      .from('[data-hero="stats"] > *', { autoAlpha: 0, y: 30,  scale: 0.95, duration: 0.5, stagger: 0.1 }, '-=0.1');

  }, { scope: containerRef });

  return (
    <section id="inicio" className="relative overflow-hidden" ref={containerRef}>

      {/* Fondo con blobs flotantes */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
        <div ref={blob1Ref} className="absolute top-20 left-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div ref={blob2Ref} className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div ref={blob3Ref} className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
      </div>

      {/* Contenido */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="text-center">

          <div data-hero="badge" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-rose-100 mb-6">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-gray-700">Material profesional para psicopedagogía</span>
          </div>

          <h1 data-hero="title" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Recursos que transforman
            </span>
            <br />
            <span className="text-gray-800">tu práctica profesional</span>
          </h1>

          <p data-hero="subtitle" className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Materiales diseñados por profesionales para estudiantes y recién recibidos en psicopedagogía.{' '}
            <span className="text-rose-600 font-medium">Herramientas reales, no solo teoría.</span>
          </p>

          <div data-hero="cta" className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToProducts}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Ver Productos
            </button>
            <button
              onClick={() => document.getElementById('testimonios')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg border border-rose-100 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              Testimonios
            </button>
          </div>

          <div data-hero="stats" className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: '+500',   label: 'Profesionales confían' },
              { value: '+50',    label: 'Recursos disponibles' },
              { value: '100%',   label: 'Digital y accesible' },
              { value: '⭐ 5.0', label: 'Valoración promedio' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-rose-50">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                  {value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Ola decorativa */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path fill="#ffffff" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
        </svg>
      </div>

    </section>
  );
}
