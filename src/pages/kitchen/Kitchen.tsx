const Kitchen = () => {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Kitchen Display</h2>
        <p className="text-sm text-slate-400">Monitor incoming orders and update their status.</p>
      </header>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-lg font-medium">Live order feed</h3>
        <p className="mt-2 text-sm text-slate-400">Subscribe to new orders and provide status controls.</p>
      </div>
    </section>
  );
};

export default Kitchen;
