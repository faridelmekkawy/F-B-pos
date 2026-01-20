const Pos = () => {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Point of Sale</h2>
        <p className="text-sm text-slate-400">
          Start orders, apply discounts, and capture payments with role-based controls.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-lg font-medium">Menu & order builder</h3>
          <p className="mt-2 text-sm text-slate-400">Bind products, categories, and modifiers.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-lg font-medium">Checkout</h3>
          <p className="mt-2 text-sm text-slate-400">Capture payments and produce receipts.</p>
        </div>
      </div>
    </section>
  );
};

export default Pos;
