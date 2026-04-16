import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency', currency: 'ARS', minimumFractionDigits: 0,
    }).format(price);

  // Hover animado con GSAP — más suave y expresivo que CSS puro
  useGSAP(() => {
    const card = cardRef.current;
    const img  = imageRef.current;
    if (!card || !img) return;

    const onEnter = () => {
      gsap.to(card, { y: -8, scale: 1.02, duration: 0.35, ease: 'power2.out' });
      gsap.to(img,  { scale: 1.07, duration: 0.5, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' });
      gsap.to(img,  { scale: 1, duration: 0.4, ease: 'power2.inOut' });
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-rose-50 hover:border-rose-200"
    >
      {/* Imagen */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          ref={imageRef}
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-rose-600 text-xs font-semibold rounded-full shadow-md">
            {product.category}
          </span>
        </div>

        {/* Botón ver detalles sobre la imagen */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => onViewDetails(product)}
            className="p-2.5 bg-white rounded-full shadow-lg hover:bg-rose-50 transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-5 h-5 text-rose-600" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Precio */}
        <div className="mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 py-2.5 px-4 border-2 border-rose-200 text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-colors text-sm"
          >
            Ver detalles
          </button>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-pink-300 to-purple-300 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm font-display"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
