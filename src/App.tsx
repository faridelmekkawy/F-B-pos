import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/login/Login';
import CustomerDisplay from './pages/customer/CustomerDisplay';
import Dashboard from './pages/dashboard/Dashboard';
import Kitchen from './pages/kitchen/Kitchen';
import Pos from './pages/pos/Pos';
import Receipt from './pages/receipt/Receipt';
import { SessionGuard } from './lib/session';

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <SessionGuard deviceType="dashboard" roles={['owner', 'manager', 'viewer']}>
              <Dashboard />
            </SessionGuard>
          }
        />
        <Route
          path="/pos"
          element={
            <SessionGuard deviceType="pos" roles={['owner', 'manager', 'cashier']}>
              <Pos />
            </SessionGuard>
          }
        />
        <Route
          path="/kitchen"
          element={
            <SessionGuard deviceType="kitchen" roles={['kitchen']}>
              <Kitchen />
            </SessionGuard>
          }
        />
        <Route
          path="/customer"
          element={
            <SessionGuard deviceType="customer" roles={['system', 'viewer', 'owner', 'manager']}>
              <CustomerDisplay />
            </SessionGuard>
          }
        />
        <Route
          path="/receipt/:orderId"
          element={
            <SessionGuard deviceType="pos" roles={['owner', 'manager', 'cashier']}>
              <Receipt />
            </SessionGuard>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
