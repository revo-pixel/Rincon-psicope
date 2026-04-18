export default function Failure() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">❌</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago no completado</h1>
        <p className="text-gray-600 mb-6">Hubo un problema con tu pago. Podés intentarlo nuevamente.</p>
        <a href="/" className="inline-block py-3 px-8 bg-gradient-to-r from-rose-500 to-purple-500 text-white font-bold rounded-xl">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}