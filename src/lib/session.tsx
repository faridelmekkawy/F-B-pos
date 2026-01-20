import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export type StaffRole = 'owner' | 'manager' | 'cashier' | 'kitchen' | 'viewer' | 'system';
export type DeviceType = 'dashboard' | 'pos' | 'kitchen' | 'customer';

export type SessionRecord = {
  staffId: string;
  vendorId: string;
  role: StaffRole;
  deviceType: DeviceType;
  expiresAt: string;
};

const SESSION_KEY = 'pos.session';

export const loadSession = (): SessionRecord | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SessionRecord;
    if (!parsed.expiresAt || new Date(parsed.expiresAt).getTime() < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const SessionGuard = ({
  deviceType,
  roles,
  children
}: PropsWithChildren<{ deviceType: DeviceType; roles: StaffRole[] }>) => {
  const session = loadSession();
  if (!session) {
    return <Navigate to="/dashboard" replace />;
  }
  if (session.deviceType !== deviceType) {
    return <Navigate to="/dashboard" replace />;
  }
  if (!roles.includes(session.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};
