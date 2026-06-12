import { useSelector } from 'react-redux';
import { ShieldCheck } from 'lucide-react';
import { selectCurrentUser } from '../../features/auth/authSlice';

export function DashboardPage() {
  const user = useSelector(selectCurrentUser);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-market text-white">
          <ShieldCheck size={20} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Account dashboard</h1>
          <p className="text-sm text-slate-500">Authenticated Phase 2 route</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-1 font-semibold">{user?.fullName}</p>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Role</p>
          <p className="mt-1 font-semibold">{user?.role}</p>
        </div>

        <div className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-1 font-semibold">{user?.email}</p>
        </div>
      </div>
    </section>
  );
}