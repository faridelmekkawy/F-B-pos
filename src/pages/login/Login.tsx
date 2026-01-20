import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../../lib/session';
import { getStaff } from '../../lib/store';

const Login = () => {
  const staff = useMemo(() => getStaff(), []);
  const [staffId, setStaffId] = useState(staff[0]?.id ?? '');
  const [pin, setPin] = useState('');
  const [deviceType, setDeviceType] = useState<'pos' | 'kitchen' | 'dashboard' | 'customer'>(
    'pos'
  );
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const selected = staff.find((member) => member.id === staffId);
    if (!selected) {
      setError('Select a staff member.');
      return;
    }
    if (selected.pin !== pin) {
      setError('Invalid PIN.');
      return;
    }

    createSession({
      staffId: selected.id,
      vendorId: 'demo-vendor',
      role: selected.role,
      deviceType,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString()
    });

    const routeMap: Record<typeof deviceType, string> = {
      pos: '/pos',
      kitchen: '/kitchen',
      dashboard: '/dashboard',
      customer: '/customer'
    };

    navigate(routeMap[deviceType]);
  };

  return (
    <section className="mx-auto max-w-lg space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="text-sm text-slate-400">
          Choose a staff profile and device type to start a secure session.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <label className="block text-sm">
          Staff member
          <select
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
            value={staffId}
            onChange={(event) => setStaffId(event.target.value)}
          >
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} · {member.role}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          PIN
          <input
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
            type="password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
        </label>
        <label className="block text-sm">
          Device type
          <select
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
            value={deviceType}
            onChange={(event) => setDeviceType(event.target.value as typeof deviceType)}
          >
            <option value="pos">POS</option>
            <option value="kitchen">Kitchen</option>
            <option value="dashboard">Dashboard</option>
            <option value="customer">Customer display</option>
          </select>
        </label>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Start session
        </button>
      </form>
    </section>
  );
};

export default Login;
