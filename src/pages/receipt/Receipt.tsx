import { useParams } from 'react-router-dom';

const Receipt = () => {
  const { orderId } = useParams();
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Receipt</h2>
        <p className="text-sm text-slate-400">Print-ready receipt for order {orderId}.</p>
      </header>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-lg font-medium">Receipt template</h3>
        <p className="mt-2 text-sm text-slate-400">Populate totals, taxes, and payment method.</p>
      </div>
    </section>
  );
};

export default Receipt;
