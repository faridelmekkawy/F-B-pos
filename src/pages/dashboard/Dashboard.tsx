import { FormEvent, useMemo, useState } from 'react';
import {
  Category,
  Product,
  getCategories,
  getOrders,
  getProducts,
  getStaff,
  saveCategory,
  saveProduct,
  updateProductAvailability
} from '../../lib/store';

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>(() => getCategories());
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const orders = useMemo(() => getOrders(), []);
  const staff = useMemo(() => getStaff(), []);

  const [categoryName, setCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState(categories[0]?.id ?? '');
  const [productPrice, setProductPrice] = useState('');

  const handleAddCategory = (event: FormEvent) => {
    event.preventDefault();
    if (!categoryName.trim()) {
      return;
    }
    const nextCategory: Category = {
      id: `cat-${Date.now()}`,
      name: categoryName.trim(),
      sortOrder: categories.length + 1,
      isActive: true
    };
    setCategories(saveCategory(nextCategory));
    setCategoryName('');
  };

  const handleAddProduct = (event: FormEvent) => {
    event.preventDefault();
    if (!productName.trim() || !productCategory || !productPrice) {
      return;
    }
    const nextProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      categoryId: productCategory,
      price: Number(productPrice),
      isAvailable: true
    };
    setProducts(saveProduct(nextProduct));
    setProductName('');
    setProductPrice('');
  };

  const toggleAvailability = (productId: string, isAvailable: boolean) => {
    setProducts(updateProductAvailability(productId, isAvailable));
  };

  const totalSales = orders
    .filter((order) => order.status === 'completed')
    .reduce((sum, order) => sum + order.totals.total, 0);

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold">Vendor Dashboard</h2>
        <p className="text-sm text-slate-400">
          Manage branding, staff, devices, products, and analytics for this vendor.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-lg font-medium">Branding & setup</h3>
          <p className="mt-2 text-sm text-slate-400">Logo upload and color controls go here.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-lg font-medium">Device registry</h3>
          <p className="mt-2 text-sm text-slate-400">Approve devices and assign device types.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-medium">Categories</h3>
            <form onSubmit={handleAddCategory} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                placeholder="Add category"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Save
              </button>
            </form>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-xs text-slate-500">#{category.sortOrder}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-medium">Products</h3>
            <form onSubmit={handleAddProduct} className="mt-4 grid gap-2 sm:grid-cols-[2fr_1fr_1fr]">
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                placeholder="Product name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
              />
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                value={productCategory}
                onChange={(event) => setProductCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2"
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                value={productPrice}
                onChange={(event) => setProductPrice(event.target.value)}
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Add product
              </button>
            </form>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {products.map((product) => (
                <li key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-slate-500">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs ${
                      product.isAvailable
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                    onClick={() => toggleAvailability(product.id, !product.isAvailable)}
                  >
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-medium">Staff & roles</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {staff.map((member) => (
                <li key={member.id} className="flex items-center justify-between">
                  <span>{member.name}</span>
                  <span className="text-xs text-slate-500">{member.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-medium">Analytics</h3>
            <p className="mt-2 text-3xl font-semibold">${totalSales.toFixed(2)}</p>
            <p className="text-xs text-slate-400">Completed sales total</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-medium">Orders</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id} className="flex items-center justify-between">
                  <span>#{order.orderNumber}</span>
                  <span className="text-xs text-slate-500">{order.status}</span>
                </li>
              ))}
              {!orders.length ? (
                <li className="text-xs text-slate-500">No orders yet.</li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
