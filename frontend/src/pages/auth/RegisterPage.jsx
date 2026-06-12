import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus } from 'lucide-react';
import { register } from '../../features/auth/authSlice';

export function RegisterPage() {
  const dispatch = useDispatch();
  const { status, error, registration } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function submit(event) {
    event.preventDefault();
    dispatch(register(form));
  }

  return (
    <section className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-market text-white">
          <UserPlus size={20} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Create account</h1>
          <p className="text-sm text-slate-500">Register with a college email</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-market focus:ring-2 focus:ring-market/20"
            name="fullName"
            value={form.fullName}
            onChange={updateField}
            required
          />
        </label>

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
            minLength={8}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Account type</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-market focus:ring-2 focus:ring-market/20"
            name="role"
            value={form.role}
            onChange={updateField}
          >
            <option value="STUDENT">Student</option>
            <option value="SELLER">Seller</option>
          </select>
        </label>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {registration && (
          <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <p>Account created. Verify your email before signing in.</p>
            {registration.devVerificationToken && (
              <p className="mt-2 break-all font-mono text-xs">{registration.devVerificationToken}</p>
            )}
            <Link className="mt-2 inline-block font-medium text-market hover:text-teal-800" to="/verify-email">
              Verify email
            </Link>
          </div>
        )}

        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-market px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={status === 'loading'}
        >
          <UserPlus size={18} aria-hidden="true" />
          {status === 'loading' ? 'Creating account' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-medium text-market hover:text-teal-800" to="/login">
          Sign in
        </Link>
      </p>
    </section>
  );
}