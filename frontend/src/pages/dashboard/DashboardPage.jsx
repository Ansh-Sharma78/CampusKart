import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BadgeCheck,
  ClipboardList,
  MapPin,
  PackagePlus,
  ShieldCheck,
  ShoppingCart,
  Store,
  UserCircle,
} from "lucide-react";
import { selectCurrentUser } from "../../features/auth/authSlice";

function StatCard({ icon: Icon, label, value, tone = "emerald" }) {
  const toneClasses = {
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
        <Icon size={22} aria-hidden="true" />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
        <Icon size={22} aria-hidden="true" />
      </div>

      <h2 className="mt-4 text-base font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}

export function DashboardPage() {
  const user = useSelector(selectCurrentUser);

  const displayName = user?.fullName || "CampusKart user";
  const email = user?.email || "Not available";
  const role = user?.role || "STUDENT";

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100 ring-1 ring-white/15">
              <ShieldCheck size={16} aria-hidden="true" />
              Secure student account
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, {displayName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Manage your CampusKart activity, browse listings, track orders,
              update addresses, and sell campus essentials from one place.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-bold text-white">{displayName}</p>
                <p className="mt-1 text-sm text-slate-300">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={UserCircle}
          label="Account name"
          value={displayName}
          tone="emerald"
        />

        <StatCard
          icon={BadgeCheck}
          label="Current role"
          value={role}
          tone="blue"
        />

        <StatCard
          icon={ShieldCheck}
          label="Auth status"
          value="Logged in"
          tone="slate"
        />

        <StatCard
          icon={Store}
          label="Marketplace access"
          value="Active"
          tone="amber"
        />
      </div>

      <div>
        <div className="mb-4">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
            Quick actions
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            What would you like to do?
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            icon={Store}
            title="Browse products"
            description="Explore books, gadgets, notes, furniture, and campus essentials."
            to="/products"
          />

          <ActionCard
            icon={ShoppingCart}
            title="View cart"
            description="Review selected items and continue to checkout."
            to="/cart"
          />

          <ActionCard
            icon={ClipboardList}
            title="Track orders"
            description="View order history, payment status, and order details."
            to="/orders"
          />

          <ActionCard
            icon={MapPin}
            title="Manage addresses"
            description="Add, edit, delete, and set your default delivery address."
            to="/addresses"
          />

          <ActionCard
            icon={PackagePlus}
            title="Sell an item"
            description="Create a campus listing for books, gadgets, cycles, or supplies."
            to="/seller/products/new"
          />
        </div>
      </div>
    </section>
  );
}