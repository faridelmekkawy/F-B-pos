import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
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
            <SessionGuard deviceType="customer" roles={['system']}>
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
        <Route path="/" element={<Navigate to="/pos" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
