import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn } from 'lucide-react';
import { login } from '../../features/auth/authSlice';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const from = location.state?.from?.pathname ?? '/dashboard';

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault(); //Stops browser reload.

    const result = await dispatch(login(form));

    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-market text-white">
          <LogIn size={20} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm text-slate-500">Use your verified college account</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">College email</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-market focus:ring-2 focus:ring-market/20"
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-market focus:ring-2 focus:ring-market/20"
            type="password"
            name="password"
            value={form.password}
            onChange={updateField}
            required
          />
        </label>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-market px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={status === 'loading'}
        >
          <LogIn size={18} aria-hidden="true" />
          {status === 'loading' ? 'Signing in' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        New to CampusKart?{' '}
        <Link className="font-medium text-market hover:text-teal-800" to="/register">
          Create account
        </Link>
      </p>
    </section>
  );
}