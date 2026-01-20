import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">F&B POS</p>
            <h1 className="text-lg font-semibold">Operations Console</h1>
          </div>
          <div className="text-sm text-slate-400">Session protected</div>
        </div>
      </header>
      <main className="px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
