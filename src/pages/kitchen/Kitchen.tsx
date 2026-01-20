import { useEffect, useState } from 'react';
import { getOrders, Order, updateOrderStatus } from '../../lib/store';

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>(() => getOrders());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOrders(getOrders());
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const handleStatus = (orderId: string, status: Order['status']) => {
    setOrders(updateOrderStatus(orderId, status));
  };

  const activeOrders = orders.filter((order) => order.status !== 'completed');

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Kitchen Display</h2>
        <p className="text-sm text-slate-400">Monitor incoming orders and update their status.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {activeOrders.map((order) => (
          <div key={order.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Order #{order.orderNumber}</p>
                <p className="text-xs text-slate-400">{order.status.replace('_', ' ')}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs"
                  onClick={() => handleStatus(order.id, 'in_progress')}
                >
                  In progress
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs"
                  onClick={() => handleStatus(order.id, 'ready')}
                >
                  Ready
                </button>
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center justify-between">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!activeOrders.length ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-6 text-sm text-slate-500">
            No active orders yet.
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Kitchen;
