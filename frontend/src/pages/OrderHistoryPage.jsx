import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  PackageSearch,
  ReceiptText,
  XCircle,
} from "lucide-react";
import { getOrders } from "../features/orders/orderApi";

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString();
}

function getStatusStyles(status) {
  const styles = {
    PENDING_PAYMENT: {
      label: "Pending payment",
      icon: Clock,
      className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    CONFIRMED: {
      label: "Confirmed",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    CANCELLED: {
      label: "Cancelled",
      icon: XCircle,
      className: "bg-red-50 text-red-700 ring-red-200",
    },
  };

  return (
    styles[status] || {
      label: status,
      icon: ReceiptText,
      className: "bg-slate-100 text-slate-700 ring-slate-200",
    }
  );
}

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const summary = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "PENDING_PAYMENT")
        .length,
      confirmed: orders.filter((order) => order.status === "CONFIRMED").length,
      cancelled: orders.filter((order) => order.status === "CANCELLED").length,
    };
  }, [orders]);

  async function loadOrders() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getOrders();

      setOrders(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to load orders"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-300">
              Orders
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your order history
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Track placed orders, payment state, delivery address, and order
              details from one clean timeline.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-50"
          >
            Browse products
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {!isLoading && !errorMessage && orders.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total orders</p>
            <p className="mt-1 text-2xl font-black text-slate-950">
              {summary.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending payment
            </p>
            <p className="mt-1 text-2xl font-black text-amber-700">
              {summary.pending}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Confirmed</p>
            <p className="mt-1 text-2xl font-black text-emerald-700">
              {summary.confirmed}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Cancelled</p>
            <p className="mt-1 text-2xl font-black text-red-700">
              {summary.cancelled}
            </p>
          </div>
        </div>
      )}

      {isLoading && <OrderSkeleton />}

      {!isLoading && errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && orders.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
            <PackageSearch size={30} aria-hidden="true" />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-950">
            No orders yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Place your first order from the campus marketplace and it will
            appear here.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            Browse products
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      )}

      {!isLoading && !errorMessage && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusStyles(order.status);
            const StatusIcon = status.icon;

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <ReceiptText size={24} aria-hidden="true" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-slate-950">
                          Order #{order.id}
                        </p>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ring-1 ${status.className}`}
                        >
                          <StatusIcon size={13} aria-hidden="true" />
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-2 text-2xl font-black text-emerald-700">
                        Rs. {order.totalAmount}
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>

                      <p className="mt-2 text-sm text-slate-600">
                        {order.items?.length || 0} item(s) • {order.campus}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-4 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-50"
                  >
                    View details
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}