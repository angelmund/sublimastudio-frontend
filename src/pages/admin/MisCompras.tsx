import { Package, Truck, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function MisCompras() {
  const navigate = useNavigate();

  // Datos simulados (Mock) - Después los reemplazaremos con datos reales de tu API
  const comprasMock = [
    {
      id: 'PED-001',
      fecha: '22 Oct 2026',
      total: 350.00,
      estado: 'entregado',
      articulos: ['Taza Mágica Personalizada', 'Playera Sublimada'],
      imagen: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 'PED-002',
      fecha: '20 Oct 2026',
      total: 120.00,
      estado: 'en_camino',
      articulos: ['Termo Acero Inoxidable'],
      imagen: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=200&auto=format&fit=crop'
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><CheckCircle className="h-3.5 w-3.5" /> Entregado</span>;
      case 'en_camino':
        return <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"><Truck className="h-3.5 w-3.5" /> En camino</span>;
      default:
        return <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"><Package className="h-3.5 w-3.5" /> Procesando</span>;
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-6">
      <PageHeader 
        title="Mis Compras" 
        subtitle="Historial y estado de todos tus pedidos."
      />

      {comprasMock.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 py-20 text-center">
          <ShoppingBag className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-1 text-lg font-bold text-slate-900">Aún no tienes compras</h3>
          <p className="mb-6 text-slate-500">Explora nuestro catálogo y encuentra artículos increíbles.</p>
          <Button onClick={() => navigate('/articulos')}>Ir al Catálogo</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {comprasMock.map((compra) => (
            <div 
              key={compra.id} 
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-5">
                <img 
                  src={compra.imagen} 
                  alt="Pedido" 
                  className="h-20 w-20 shrink-0 rounded-xl bg-slate-100 object-cover"
                />
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="font-bold text-slate-900">{compra.id}</h4>
                    {getEstadoBadge(compra.estado)}
                  </div>
                  <p className="text-sm text-slate-500">{compra.fecha}</p>
                  <p className="text-sm font-medium text-slate-700 mt-1 truncate max-w-[200px] sm:max-w-md">
                    {compra.articulos.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 sm:border-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-2">
                <span className="text-lg font-black text-slate-900">${compra.total.toFixed(2)}</span>
                <button className="flex items-center text-sm font-semibold text-flame-600 hover:text-flame-700">
                  Ver detalles <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}