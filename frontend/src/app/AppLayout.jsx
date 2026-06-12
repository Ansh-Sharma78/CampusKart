import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, ShoppingBag } from 'lucide-react';
import { logout, selectCurrentUser } from '../features/auth/authSlice';

export function AppLayout() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-market text-white">
              <ShoppingBag size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">CampusKart</p>
              <p className="mt-1 text-sm text-slate-500">Campus marketplace foundation</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" to="/">
              Home
            </Link>

            {user ? (
              <>
                <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" to="/dashboard">
                  Dashboard
                </Link>

                <button
                  className="flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  type="button"
                  onClick={() => dispatch(logout())}
                >
                  <LogOut size={16} aria-hidden="true" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" to="/login">
                  Login
                </Link>

                <Link className="rounded-md bg-market px-3 py-2 text-sm font-medium text-white hover:bg-teal-800" to="/register">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}