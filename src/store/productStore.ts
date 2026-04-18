import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

// Convierte el formato de Supabase (snake_case) al formato de tu app (camelCase)
function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    shortDescription: row.short_description,
    fullDescription: row.description,
    price: row.price,
    category: row.category,
    images: row.images ?? [],
    featured: row.featured ?? false,
    type: row.type ?? 'digital',
  };
}

interface ProductState {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  loading: false,

  // Trae todos los productos desde Supabase
 fetchProducts: async () => {
    console.log('fetchProducts llamado'); // agregá esta línea
    set({ loading: true });
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('data:', data); // y esta
    console.log('error:', error); // y esta

    if (error) {
      console.error('Error al traer productos:', error.message);
      set({ loading: false });
      return;
    }

    set({ products: data.map(mapProduct), loading: false });
  },

  // Agrega un producto nuevo en Supabase
  addProduct: async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        short_description: product.shortDescription,
        description: product.fullDescription,
        price: product.price,
        category: product.category,
        images: product.images,
        featured: product.featured ?? false,
        type: product.type ?? 'digital',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error al agregar producto:', error.message);
      return;
    }

    set({ products: [mapProduct(data), ...get().products] });
  },

  // Edita un producto existente en Supabase
  updateProduct: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updatedData.name,
        short_description: updatedData.shortDescription,
        description: updatedData.fullDescription,
        price: updatedData.price,
        category: updatedData.category,
        images: updatedData.images,
        featured: updatedData.featured,
        type: updatedData.type,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar producto:', error.message);
      return;
    }

    set({
      products: get().products.map(p => p.id === id ? mapProduct(data) : p),
    });
  },

  // Elimina un producto en Supabase
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar producto:', error.message);
      return;
    }

    set({ products: get().products.filter(p => p.id !== id) });
  },
}));
