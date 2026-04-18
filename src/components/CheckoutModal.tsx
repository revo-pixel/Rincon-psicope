import { useState } from 'react';
import { X, CreditCard, Building2, MessageCircle, User, Mail, Phone, MapPin, Home } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { CustomerData } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const hasPhysical = items.some(item => item.product.type === 'physical');
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'mercadopago',
  });
  const [step, setStep] = useState<'form' | 'payment'>('form');
const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleMercadoPago = async () => {
    setLoading(true);
    try {
      const mpItems = items.map(item => ({
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        currency_id: 'ARS',
      }));

      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: mpItems,
          payer: { email: customerData.email, name: customerData.fullName },
          back_urls: {
            success: 'https://entrerizospsicope.vercel.app/success',
            failure: 'https://entrerizospsicope.vercel.app/failure',
            pending: 'https://entrerizospsicope.vercel.app/success',
          },
        }),
      });

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Error al conectar con MercadoPago. Intente nuevamente.');
      }
    } catch (err) {
      alert('Error al conectar con MercadoPago. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppTransfer = () => {
    const orderDetails = items
      .map((item) => `• ${item.product.name} x${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`)
      .join('\n');

    const message = encodeURIComponent(
      `¡Hola! Quiero realizar una compra.\n\n` +
      `*Datos del cliente:*\n` +
      `Nombre: ${customerData.fullName}\n` +
      `Email: ${customerData.email}\n` +
      `Teléfono: ${customerData.phone}\n` +
      `Dirección: ${customerData.address}, ${customerData.city}\n\n` +
      `*Pedido:*\n${orderDetails}\n\n` +
      `*Total: ${formatPrice(getTotalPrice())}*\n\n` +
      `Método de pago: Transferencia bancaria\n\n` +
      `Adjunto comprobante de transferencia.`
    );

    window.open(`https://wa.me/5491112345678?text=${message}`, '_blank');
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 'form' ? 'Datos de compra' : 'Método de pago'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {step === 'form' ? (
            <form onSubmit={handleSubmitForm} className="space-y-6">
              {/* Personal Data */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-500" />
                  Datos personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={customerData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={customerData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={customerData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="Tu teléfono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {hasPhysical && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  Dirección de envío
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="Calle y número"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="Tu ciudad"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código postal
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="postalCode"
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="Ej: 1234"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entre calles
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="streetsBetween"
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="Ej: Av. Corrientes y Callao"
                      />
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-rose-500" />
                  Método de pago
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      customerData.paymentMethod === 'mercadopago'
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-rose-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercadopago"
                      checked={customerData.paymentMethod === 'mercadopago'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      customerData.paymentMethod === 'mercadopago'
                        ? 'border-rose-500 bg-rose-500'
                        : 'border-gray-300'
                    }`}>
                      {customerData.paymentMethod === 'mercadopago' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <CreditCard className="w-6 h-6 text-blue-500" />
                    <span className="font-medium text-gray-700">MercadoPago</span>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      customerData.paymentMethod === 'transfer'
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-rose-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={customerData.paymentMethod === 'transfer'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      customerData.paymentMethod === 'transfer'
                        ? 'border-rose-500 bg-rose-500'
                        : 'border-gray-300'
                    }`}>
                      {customerData.paymentMethod === 'transfer' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <Building2 className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-gray-700">Transferencia</span>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Resumen del pedido</h4>
                <div className="space-y-2 mb-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-gray-800">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Continuar al pago
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {customerData.paymentMethod === 'mercadopago' ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Pago con MercadoPago</h3>
                  <p className="text-gray-600 mb-6">
                    Serás redirigido a MercadoPago para completar tu pago de forma segura.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(getTotalPrice())}
                    </p>
                  </div>
                  <button
                    onClick={handleMercadoPago}
                    disabled={loading}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    {loading ? 'Redirigiendo...' : 'Pagar con MercadoPago'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Transferencia Bancaria</h3>
                  <p className="text-gray-600 mb-6">
                    Realiza la transferencia y envíanos el comprobante por WhatsApp.
                  </p>

                  {/* Bank Details */}
                  <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-xl p-6 mb-6 text-left">
                    <h4 className="font-semibold text-gray-800 mb-3">Datos bancarios:</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Banco:</span> <span className="font-medium">Banco Nación</span></p>
                      <p><span className="text-gray-500">Titular:</span> <span className="font-medium">Rincón Psicope</span></p>
                      <p><span className="text-gray-500">CBU:</span> <span className="font-medium font-mono">0110000000000000000001</span></p>
                      <p><span className="text-gray-500">Alias:</span> <span className="font-medium font-mono">RINCON.PSICOPE</span></p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-1">Total a transferir</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(getTotalPrice())}
                    </p>
                  </div>

                  <button
                    onClick={handleWhatsAppTransfer}
                    className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar comprobante por WhatsApp
                  </button>
                </div>
              )}

              <button
                onClick={() => setStep('form')}
                className="w-full py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Volver atrás
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
