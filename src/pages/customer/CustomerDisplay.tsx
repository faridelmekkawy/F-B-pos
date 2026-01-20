import { useEffect, useState } from 'react';
import { getOrders, Order } from '../../lib/store';

const CustomerDisplay = () => {
  const [orders, setOrders] = useState<Order[]>(() => getOrders());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOrders(getOrders());
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const current = orders.find((order) => order.status !== 'completed');
  const readyOrders = orders.filter((order) => order.status === 'ready');

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Customer Display</h2>
        <p className="text-sm text-slate-400">Show current order totals and status in full-screen mode.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-medium">Now serving</h3>
          {current ? (
            <div className="mt-4 space-y-2">
              <p className="text-3xl font-semibold">#{current.orderNumber}</p>
              <p className="text-sm text-slate-400">Status: {current.status.replace('_', ' ')}</p>
              <p className="text-4xl font-semibold">${current.totals.total.toFixed(2)}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Waiting for the next order.</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-medium">Ready for pickup</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {readyOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between">
                <span>#{order.orderNumber}</span>
                <span className="text-xs text-emerald-400">Ready</span>
              </li>
            ))}
            {!readyOrders.length ? <li className="text-xs text-slate-500">None ready yet.</li> : null}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CustomerDisplay;
