import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, BookOpen } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 shadow-lg sticky top-0 z-50 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Entre Rizos Psicope" className="h-20 md:h-24 w-auto" />
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 via-pink-500 to-green-500 bg-clip-text text-transparent leading-tight">
                Entre Rizos
              </span>
              <span className="text-sm md:text-base text-gray-700 font-semibold -mt-1">
                Psicope
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('productos')}
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
            >
              Productos
            </button>
            <button
              onClick={() => scrollToSection('testimonios')}
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
            >
              Testimonios
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
            >
              Contacto
            </button>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative bg-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all border border-rose-100 hover:border-rose-300"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden bg-white p-2 rounded-lg shadow-md border border-rose-100"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-rose-600" />
              ) : (
                <Menu className="w-6 h-6 text-rose-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-rose-100 bg-white/80 backdrop-blur-sm rounded-b-2xl">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('inicio')}
                className="px-4 py-3 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors font-medium"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection('productos')}
                className="px-4 py-3 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors font-medium"
              >
                Productos
              </button>
              <button
                onClick={() => scrollToSection('testimonios')}
                className="px-4 py-3 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors font-medium"
              >
                Testimonios
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="px-4 py-3 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors font-medium"
              >
                Contacto
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
