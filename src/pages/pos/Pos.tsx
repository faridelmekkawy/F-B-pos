import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Shift } from '../../lib/store';
import {
  createOrder,
  getActiveShift,
  getCategories,
  getProducts,
  openShift,
  closeShift
} from '../../lib/store';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

const Pos = () => {
  const navigate = useNavigate();
  const categories = useMemo(() => getCategories(), []);
  const products = useMemo(() => getProducts(), []);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? '');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountType, setDiscountType] = useState<'none' | 'percent' | 'fixed'>('none');
  const [discountValue, setDiscountValue] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [cashReceived, setCashReceived] = useState('0');
  const [shiftOpenCash, setShiftOpenCash] = useState('100');
  const [shiftCloseCash, setShiftCloseCash] = useState('0');
  const [activeShift, setActiveShift] = useState<Shift | null>(() => getActiveShift() ?? null);

  const filteredProducts = products.filter(
    (product) => product.categoryId === selectedCategory && product.isAvailable
  );

  const addToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount =
    discountType === 'percent'
      ? (subtotal * Number(discountValue || 0)) / 100
      : discountType === 'fixed'
      ? Number(discountValue || 0)
      : 0;
  const tax = subtotal * 0.08;
  const total = Math.max(subtotal - discountAmount, 0) + tax;
  const receivedAmount = Number(cashReceived || 0);
  const changeDue = paymentMethod === 'cash' ? Math.max(receivedAmount - total, 0) : 0;

  const handleOpenShift = () => {
    const shifts = openShift(Number(shiftOpenCash || 0));
    setActiveShift(shifts.find((shift) => !shift.closedAt) ?? null);
  };

  const handleCloseShift = () => {
    closeShift(Number(shiftCloseCash || 0));
    setActiveShift(null);
  };

  const handleCheckout = () => {
    if (!cart.length) {
      return;
    }
    const order = createOrder({
      status: 'new',
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      discount: {
        type: discountType,
        value: Number(discountValue || 0)
      },
      totals: {
        subtotal,
        discount: discountAmount,
        tax,
        total
      },
      payment: {
        method: paymentMethod,
        received: paymentMethod === 'cash' ? receivedAmount : undefined,
        change: paymentMethod === 'cash' ? changeDue : undefined
      }
    });
    setCart([]);
    setDiscountType('none');
    setDiscountValue('0');
    setCashReceived('0');
    navigate(`/receipt/${order.id}`);
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Point of Sale</h2>
        <p className="text-sm text-slate-400">
          Start orders, apply discounts, and capture payments with role-based controls.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedCategory === category.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'border border-slate-700 text-slate-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left"
                onClick={() => addToCart(product.id)}
              >
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-slate-400">${product.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <h3 className="text-lg font-medium">Shift</h3>
            {activeShift ? (
              <div className="space-y-2 text-sm text-slate-300">
                <p>Opened at {new Date(activeShift.openedAt).toLocaleTimeString()}</p>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                    type="number"
                    min="0"
                    step="1"
                    value={shiftCloseCash}
                    onChange={(event) => setShiftCloseCash(event.target.value)}
                  />
                  <button
                    type="button"
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm"
                    onClick={handleCloseShift}
                  >
                    Close shift
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-slate-300">
                <p>No active shift.</p>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                    type="number"
                    min="0"
                    step="1"
                    value={shiftOpenCash}
                    onChange={(event) => setShiftOpenCash(event.target.value)}
                  />
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950"
                    onClick={handleOpenShift}
                  >
                    Open shift
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-medium">Current order</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {cart.map((item) => (
                <li key={item.productId} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-slate-700 px-2"
                      onClick={() => updateQuantity(item.productId, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="rounded-full border border-slate-700 px-2"
                      onClick={() => updateQuantity(item.productId, 1)}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
              {!cart.length ? <li className="text-xs text-slate-500">Add items to start.</li> : null}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <h3 className="text-lg font-medium">Checkout</h3>
            <div className="flex items-center gap-2">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                value={discountType}
                onChange={(event) => setDiscountType(event.target.value as typeof discountType)}
              >
                <option value="none">No discount</option>
                <option value="percent">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                type="number"
                min="0"
                step="0.01"
                value={discountValue}
                onChange={(event) => setDiscountValue(event.target.value)}
              />
            </div>
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value as typeof paymentMethod)}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="wallet">Wallet</option>
            </select>
            {paymentMethod === 'cash' ? (
              <div className="flex items-center gap-2">
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashReceived}
                  onChange={(event) => setCashReceived(event.target.value)}
                  placeholder="Cash received"
                />
                <span className="text-sm text-slate-400">Change ${changeDue.toFixed(2)}</span>
              </div>
            ) : null}
            <div className="space-y-1 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
              onClick={handleCheckout}
            >
              Complete order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pos;
