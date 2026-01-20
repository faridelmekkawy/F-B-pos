const CustomerDisplay = () => {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Customer Display</h2>
        <p className="text-sm text-slate-400">Show current order totals and status in full-screen mode.</p>
      </header>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-lg font-medium">Order status board</h3>
        <p className="mt-2 text-sm text-slate-400">Render a read-only feed for customers.</p>
      </div>
    </section>
  );
};

export default CustomerDisplay;
