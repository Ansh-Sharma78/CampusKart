import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { cancelOrder, getOrder } from "../features/orders/orderApi";
import {
  confirmPayment,
  getPaymentStatus,
  initiatePayment,
} from "../features/payments/paymentApi";

function buildImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"}${imageUrl}`;
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString();
}

function getStatusMeta(status) {
  const meta = {
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
    meta[status] || {
      label: status,
      icon: PackageCheck,
      className: "bg-slate-100 text-slate-700 ring-slate-200",
    }
  );
}

function DetailSkeleton() {
  return (
    <section className="space-y-6">
      <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
      <div className="h-52 animate-pulse rounded-3xl bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
        <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    </section>
  );
}

export function OrderDetailPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  async function loadOrder() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getOrder(orderId);

      setOrder(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to load order"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelOrder() {
    const confirmed = window.confirm("Cancel this order?");

    if (!confirmed) {
      return;
    }

    try {
      setIsCancelling(true);
      setErrorMessage("");

      const response = await cancelOrder(orderId);

      setOrder(response.data.data);
      setPayment(null);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to cancel order"
      );
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleInitiatePayment() {
    try {
      setIsInitiatingPayment(true);
      setErrorMessage("");
      setPaymentMessage("");

      const response = await initiatePayment({
        orderId: Number(orderId),
      });

      setPayment(response.data.data);
      setPaymentMessage(
        "Mock payment initiated. Confirm it to complete the order."
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to initiate payment"
      );
    } finally {
      setIsInitiatingPayment(false);
    }
  }

  async function handleRefreshPaymentStatus() {
    if (!payment?.id) {
      return;
    }

    try {
      setErrorMessage("");

      const response = await getPaymentStatus(payment.id);

      setPayment(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to refresh payment status"
      );
    }
  }

  async function handleConfirmPayment() {
    if (!payment?.id) {
      return;
    }

    try {
      setIsConfirmingPayment(true);
      setErrorMessage("");
      setPaymentMessage("");

      const response = await confirmPayment({
        paymentId: payment.id,
        providerPaymentId: payment.providerPaymentId,
      });

      setPayment(response.data.data);
      setPaymentMessage("Payment confirmed successfully.");

      await loadOrder();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to confirm payment"
      );
    } finally {
      setIsConfirmingPayment(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (errorMessage && !order) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
        {errorMessage}
      </section>
    );
  }

  if (!order) {
    return null;
  }

  const status = getStatusMeta(order.status);
  const StatusIcon = status.icon;

  return (
    <section className="space-y-6">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to orders
      </Link>

      <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${status.className}`}
            >
              <StatusIcon size={16} aria-hidden="true" />
              {status.label}
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Order #{order.id}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
            <p className="text-sm text-slate-300">Total amount</p>
            <p className="mt-1 text-3xl font-black text-white">
              Rs. {order.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {paymentMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {paymentMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ShoppingBag size={22} aria-hidden="true" />
            </div>

            <div>
              <h2 className="font-black text-slate-950">Ordered items</h2>
              <p className="text-sm text-slate-500">
                {order.items.length} item(s)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => {
              const imageUrl = buildImageUrl(item.productImageUrl);

              return (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[96px_1fr_auto]"
                >
                  <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.productTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-medium text-slate-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div>
                    <Link
                      to={`/products/${item.productId}`}
                      className="line-clamp-2 font-black text-slate-950 hover:text-emerald-700"
                    >
                      {item.productTitle}
                    </Link>

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Qty {item.quantity} x Rs. {item.unitPrice}
                    </p>
                  </div>

                  <p className="text-lg font-black text-emerald-700">
                    Rs. {item.lineTotal}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CreditCard size={22} aria-hidden="true" />
              </div>

              <div>
                <h2 className="font-black text-slate-950">Payment</h2>
                <p className="text-sm text-slate-500">Mock gateway</p>
              </div>
            </div>

            {order.status === "PENDING_PAYMENT" && !payment && (
              <button
                type="button"
                disabled={isInitiatingPayment}
                onClick={handleInitiatePayment}
                className="mt-5 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isInitiatingPayment ? "Starting payment..." : "Pay now"}
              </button>
            )}

            {payment && (
              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-slate-500">Payment ID</p>
                  <p className="font-bold text-slate-950">{payment.id}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-slate-500">Provider</p>
                  <p className="font-bold text-slate-950">
                    {payment.provider}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-slate-500">Status</p>
                  <p className="font-bold text-slate-950">
                    {payment.status}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-slate-500">Provider payment id</p>
                  <p className="break-all font-bold text-slate-950">
                    {payment.providerPaymentId}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshPaymentStatus}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <RefreshCcw size={16} aria-hidden="true" />
                  Refresh status
                </button>

                {payment.status === "INITIATED" && (
                  <button
                    type="button"
                    disabled={isConfirmingPayment}
                    onClick={handleConfirmPayment}
                    className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isConfirmingPayment
                      ? "Confirming..."
                      : "Confirm mock payment"}
                  </button>
                )}
              </div>
            )}

            {order.status === "CONFIRMED" && (
              <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                This order is paid and confirmed.
              </p>
            )}

            {order.status === "CANCELLED" && (
              <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                This order was cancelled.
              </p>
            )}

            {order.status === "PENDING_PAYMENT" && (
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelOrder}
                className="mt-3 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling ? "Cancelling..." : "Cancel order"}
              </button>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <MapPin size={22} aria-hidden="true" />
              </div>

              <div>
                <h2 className="font-black text-slate-950">
                  Delivery address
                </h2>
                <p className="text-sm text-slate-500">{order.campus}</p>
              </div>
            </div>

            <div className="mt-4 text-sm leading-6 text-slate-700">
              <p className="font-black text-slate-950">
                {order.recipientName}
              </p>
              <p>{order.phoneNumber}</p>
              <p className="mt-3">
                {order.addressLine1}
                {order.addressLine2 ? `, ${order.addressLine2}` : ""}
              </p>
              <p>
                {order.city}, {order.state} - {order.postalCode}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>

              <h2 className="font-black text-slate-950">Summary</h2>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-950">
                  Rs. {order.subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Payment mode</span>
                <span className="font-bold text-slate-950">Mock gateway</span>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="font-black text-slate-950">Total</span>
                <span className="font-black text-slate-950">
                  Rs. {order.totalAmount}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}