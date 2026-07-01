import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PackageSearch,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "../features/cart/cartApi";

function buildImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"}${imageUrl}`;
}

function CartSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[120px_1fr_auto]"
          >
            <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
            <div className="space-y-3">
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="h-56 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

export function CartPage() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState(null);

  async function loadCart() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getCart();

      setCart(response.data.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to load cart");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuantityChange(itemId, quantity) {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingItemId(itemId);
      setErrorMessage("");

      const response = await updateCartItem(itemId, { quantity });

      setCart(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to update cart item"
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function handleRemove(itemId) {
    try {
      setUpdatingItemId(itemId);
      setErrorMessage("");

      await removeCartItem(itemId);
      await loadCart();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to remove cart item"
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const items = cart?.items || [];

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-300">
              Shopping cart
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Review your campus finds
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Check quantities, remove items, and continue to checkout when
              you are ready.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15">
            <p className="text-sm text-slate-300">Items</p>
            <p className="text-2xl font-black">{items.length}</p>
          </div>
        </div>
      </div>

      {isLoading && <CartSkeleton />}

      {!isLoading && errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && items.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
            <PackageSearch size={30} aria-hidden="true" />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-950">
            Your cart is empty
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add books, notes, gadgets, cycles, or hostel essentials from the
            marketplace.
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

      {!isLoading && !errorMessage && items.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            {items.map((item) => {
              const imageUrl = buildImageUrl(item.productImageUrl);

              return (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:grid-cols-[120px_1fr_auto]"
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

                  <div className="min-w-0">
                    <h2 className="line-clamp-2 text-lg font-black text-slate-950">
                      {item.productTitle}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Rs. {item.unitPrice} each
                    </p>

                    <p className="mt-2 text-lg font-black text-emerald-700">
                      Rs. {item.lineTotal}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      disabled={updatingItemId === item.id}
                      onChange={(event) =>
                        handleQuantityChange(item.id, Number(event.target.value))
                      }
                      className="h-11 w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      disabled={updatingItemId === item.id}
                      onClick={() => handleRemove(item.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ShoppingBag size={22} aria-hidden="true" />
              </div>

              <div>
                <h2 className="font-black text-slate-950">Cart summary</h2>
                <p className="text-sm text-slate-500">
                  {items.length} item(s)
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-black text-slate-950">
                  Rs. {cart.subtotal}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Delivery</span>
                <span className="font-bold text-emerald-700">
                  Campus pickup
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
            >
              Continue to checkout
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}