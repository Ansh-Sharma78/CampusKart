import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, ShoppingBag, ShoppingCart } from 'lucide-react';
import { logout, selectCurrentUser } from '../features/auth/authSlice';

export function AppLayout() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-[#011124] shadow-lg">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">

          {/* Logo */}
          <Link className="flex items-center gap-3" to="/">
            <img
              src="/brand/logo.png"
              alt="CampusKart"
              className="h-11 w-11 rounded-lg object-contain"
            />

            <div>
              <p className="text-xl font-bold text-white">
                CampusKart
              </p>

              <p className="mt-1 text-sm text-slate-300">
                Campus Marketplace
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-3">

            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
              to="/"
            >
              Home
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="rounded-full p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <ShoppingCart size={22} />
            </Link>

            <Link
              to="/addresses"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Addresses
            </Link>

            <Link
              to="/orders"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Orders
            </Link>

            {user ? (
              <>
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                  to="/dashboard"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  className="rounded-lg bg-market px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}