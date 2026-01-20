import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { clearSession, loadSession } from '../../lib/session';
import { ensureSeedData } from '../../lib/store';

const AppLayout = () => {
  const session = loadSession();
  const navigate = useNavigate();

  useEffect(() => {
    ensureSeedData();
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">F&B POS</p>
            <h1 className="text-lg font-semibold">Operations Console</h1>
            {session ? (
              <p className="text-xs text-slate-400">
                {session.role.toUpperCase()} · {session.deviceType.toUpperCase()}
              </p>
            ) : null}
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            {session ? (
              <>
                <Link className="text-slate-300 hover:text-white" to="/dashboard">
                  Dashboard
                </Link>
                <Link className="text-slate-300 hover:text-white" to="/pos">
                  POS
                </Link>
                <Link className="text-slate-300 hover:text-white" to="/kitchen">
                  Kitchen
                </Link>
                <Link className="text-slate-300 hover:text-white" to="/customer">
                  Customer
                </Link>
                <Link className="text-slate-300 hover:text-white" to="/receipt/order-123">
                  Receipt
                </Link>
                <button
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
                  onClick={handleLogout}
                  type="button"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link className="rounded-full border border-slate-700 px-3 py-1 text-xs" to="/login">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
