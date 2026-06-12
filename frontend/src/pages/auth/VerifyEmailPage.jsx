import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BadgeCheck } from 'lucide-react';
import { verifyEmail } from '../../features/auth/authSlice';

export function VerifyEmailPage() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);

  async function submit(event) {
    event.preventDefault();

    const result = await dispatch(verifyEmail(token));

    if (verifyEmail.fulfilled.match(result)) {
      setVerified(true);
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-market text-white">
          <BadgeCheck size={20} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Verify email</h1>
          <p className="text-sm text-slate-500">Paste the verification token from registration</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Verification token</span>
          <textarea
            className="mt-1 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-market focus:ring-2 focus:ring-market/20"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
        </label>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {verified && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Email verified. You can now sign in.
          </p>
        )}

        <button
          className="flex w-full items-center justify-center gap-2 rounded-md bg-market px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={status === 'loading'}
        >
          <BadgeCheck size={18} aria-hidden="true" />
          {status === 'loading' ? 'Verifying' : 'Verify email'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already verified?{' '}
        <Link className="font-medium text-market hover:text-teal-800" to="/login">
          Sign in
        </Link>
      </p>
    </section>
  );
}