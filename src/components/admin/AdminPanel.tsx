import { useState, useEffect } from 'react';
import { LogOut, Package, Settings, Plus, Search } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useProductStore } from '../../store/productStore';
import ProductEditor from './ProductEditor';
import PasswordChange from './PasswordChange';
import { Product } from '../../types';

export default function AdminPanel() {
  const logout = useAdminStore((state) => state.logout);
  const products = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
              <p className="text-sm text-gray-500">Rincón Psicope</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-5 h-5" />
              Productos
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-5 h-5" />
              Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && !editingProduct && !isAddingProduct && (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Nuevo Producto
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-rose-100 text-rose-600 text-xs font-medium rounded-full mb-2">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-rose-600 mb-3">
                      {formatPrice(product.price)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 py-2 border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 py-2 border border-red-200 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron productos</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'products' && (editingProduct || isAddingProduct) && (
          <ProductEditor
            product={editingProduct}
            onClose={() => {
              setEditingProduct(null);
              setIsAddingProduct(false);
            }}
          />
        )}

        {activeTab === 'settings' && <PasswordChange />}
      </div>
    </div>
  );
}
