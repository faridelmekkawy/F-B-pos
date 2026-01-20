const Dashboard = () => {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Vendor Dashboard</h2>
        <p className="text-sm text-slate-400">
          Manage branding, staff, devices, products, and analytics for this vendor.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          'Branding & setup',
          'Staff management',
          'Device registry',
          'Products & categories',
          'Imports',
          'Analytics'
        ].map((item) => (
          <div key={item} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-medium">{item}</h3>
            <p className="mt-2 text-sm text-slate-400">Implement flow and Firestore bindings.</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
