import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useProductStore } from '../store/productStore';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

gsap.registerPlugin(ScrollTrigger);

export default function ProductsSection() {
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = ['Todos', ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    activeCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Animación: el título y badge aparecen al hacer scroll
  useGSAP(() => {
    gsap.from('[data-products="header"] > *', {
      autoAlpha: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '[data-products="header"]',
        start: 'top 85%',
      },
    });

    // Las cards aparecen de abajo hacia arriba en cascada
    gsap.from('[data-products="grid"] > *', {
      autoAlpha: 0,
      y: 50,
      scale: 0.95,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '[data-products="grid"]',
        start: 'top 85%',
      },
    });
  }, { scope: sectionRef, dependencies: [filteredProducts] });

  return (
    <section id="productos" className="py-16 md:py-24 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado de sección */}
        <div data-products="header" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-rose-600">Catálogo de productos</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Nuestros{' '}
            <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              Materiales
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Recursos profesionales diseñados para potenciar tu práctica psicopedagógica
          </p>
        </div>

        {/* Filtros de categoría */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grilla de productos */}
        <div data-products="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>

        {/* Estado vacío */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No hay productos en esta categoría</p>
          </div>
        )}
      </div>

      {/* Modal de producto */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
