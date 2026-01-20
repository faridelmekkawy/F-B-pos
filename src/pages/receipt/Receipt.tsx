import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getOrders } from '../../lib/store';

const Receipt = () => {
  const { orderId } = useParams();
  const order = useMemo(() => getOrders().find((item) => item.id === orderId), [orderId]);

  if (!order) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Receipt</h2>
        <p className="text-sm text-slate-400">Order not found.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-semibold">Receipt</h2>
        <p className="text-sm text-slate-400">Order #{order.orderNumber}</p>
      </header>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-sm">
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>${order.totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span>-${order.totals.discount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>${order.totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>${order.totals.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-500">
          Payment method: {order.payment?.method ?? 'pending'}
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm"
        onClick={() => window.print()}
      >
        Print receipt
      </button>
    </section>
  );
};

export default Receipt;
