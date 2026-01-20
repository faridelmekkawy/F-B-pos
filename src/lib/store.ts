export type Category = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: number;
  status: 'new' | 'in_progress' | 'ready' | 'completed';
  items: OrderItem[];
  discount: {
    type: 'none' | 'percent' | 'fixed';
    value: number;
  };
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  payment?: {
    method: 'cash' | 'card' | 'wallet';
    received?: number;
    change?: number;
  };
  createdAt: string;
};

export type Shift = {
  id: string;
  openedAt: string;
  closedAt?: string;
  openingCash: number;
  closingCash?: number;
};

export type Staff = {
  id: string;
  name: string;
  role: 'owner' | 'manager' | 'cashier' | 'kitchen' | 'viewer' | 'system';
  pin: string;
};

const STORAGE_KEYS = {
  categories: 'pos.categories',
  products: 'pos.products',
  orders: 'pos.orders',
  staff: 'pos.staff',
  shifts: 'pos.shifts'
};

const seedCategories: Category[] = [
  { id: 'cat-burgers', name: 'Burgers', sortOrder: 1, isActive: true },
  { id: 'cat-sides', name: 'Sides', sortOrder: 2, isActive: true },
  { id: 'cat-drinks', name: 'Drinks', sortOrder: 3, isActive: true }
];

const seedProducts: Product[] = [
  {
    id: 'prod-classic-burger',
    categoryId: 'cat-burgers',
    name: 'Classic Burger',
    price: 9.5,
    isAvailable: true
  },
  {
    id: 'prod-cheese-burger',
    categoryId: 'cat-burgers',
    name: 'Cheese Burger',
    price: 10.5,
    isAvailable: true
  },
  {
    id: 'prod-fries',
    categoryId: 'cat-sides',
    name: 'Crispy Fries',
    price: 3.25,
    isAvailable: true
  },
  {
    id: 'prod-soda',
    categoryId: 'cat-drinks',
    name: 'Soda',
    price: 2.5,
    isAvailable: true
  }
];

const seedStaff: Staff[] = [
  { id: 'staff-owner', name: 'Olivia Owner', role: 'owner', pin: '1234' },
  { id: 'staff-manager', name: 'Mason Manager', role: 'manager', pin: '2345' },
  { id: 'staff-cashier', name: 'Casey Cashier', role: 'cashier', pin: '3456' },
  { id: 'staff-kitchen', name: 'Kori Kitchen', role: 'kitchen', pin: '4567' },
  { id: 'staff-viewer', name: 'Vera Viewer', role: 'viewer', pin: '5678' }
];

const readStorage = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const ensureSeedData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.categories)) {
    writeStorage(STORAGE_KEYS.categories, seedCategories);
  }
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    writeStorage(STORAGE_KEYS.products, seedProducts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.orders)) {
    writeStorage(STORAGE_KEYS.orders, [] as Order[]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.staff)) {
    writeStorage(STORAGE_KEYS.staff, seedStaff);
  }
  if (!localStorage.getItem(STORAGE_KEYS.shifts)) {
    writeStorage(STORAGE_KEYS.shifts, [] as Shift[]);
  }
};

export const getCategories = () => readStorage<Category[]>(STORAGE_KEYS.categories, []);
export const getProducts = () => readStorage<Product[]>(STORAGE_KEYS.products, []);
export const getOrders = () => readStorage<Order[]>(STORAGE_KEYS.orders, []);
export const getStaff = () => readStorage<Staff[]>(STORAGE_KEYS.staff, []);
export const getShifts = () => readStorage<Shift[]>(STORAGE_KEYS.shifts, []);

export const getActiveShift = () => getShifts().find((shift) => !shift.closedAt);

export const saveCategory = (category: Category) => {
  const categories = getCategories();
  const next = categories.some((item) => item.id === category.id)
    ? categories.map((item) => (item.id === category.id ? category : item))
    : [...categories, category];
  writeStorage(STORAGE_KEYS.categories, next);
  return next;
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  const next = products.some((item) => item.id === product.id)
    ? products.map((item) => (item.id === product.id ? product : item))
    : [...products, product];
  writeStorage(STORAGE_KEYS.products, next);
  return next;
};

export const updateProductAvailability = (productId: string, isAvailable: boolean) => {
  const products = getProducts();
  const next = products.map((item) =>
    item.id === productId ? { ...item, isAvailable } : item
  );
  writeStorage(STORAGE_KEYS.products, next);
  return next;
};

export const createOrder = (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
  const orders = getOrders();
  const orderNumber = orders.length ? Math.max(...orders.map((o) => o.orderNumber)) + 1 : 1001;
  const newOrder: Order = {
    ...order,
    id: `order-${Date.now()}`,
    orderNumber,
    createdAt: new Date().toISOString()
  };
  const next = [newOrder, ...orders];
  writeStorage(STORAGE_KEYS.orders, next);
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getOrders();
  const next = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  writeStorage(STORAGE_KEYS.orders, next);
  return next;
};

export const completeOrderPayment = (orderId: string, payment: Order['payment']) => {
  const orders = getOrders();
  const next = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: 'completed',
          payment
        }
      : order
  );
  writeStorage(STORAGE_KEYS.orders, next);
  return next;
};

export const openShift = (openingCash: number) => {
  const shifts = getShifts();
  if (shifts.some((shift) => !shift.closedAt)) {
    return shifts;
  }
  const nextShift: Shift = {
    id: `shift-${Date.now()}`,
    openedAt: new Date().toISOString(),
    openingCash
  };
  const next = [nextShift, ...shifts];
  writeStorage(STORAGE_KEYS.shifts, next);
  return next;
};

export const closeShift = (closingCash: number) => {
  const shifts = getShifts();
  const next = shifts.map((shift) =>
    shift.closedAt
      ? shift
      : {
          ...shift,
          closingCash,
          closedAt: new Date().toISOString()
        }
  );
  writeStorage(STORAGE_KEYS.shifts, next);
  return next;
};
