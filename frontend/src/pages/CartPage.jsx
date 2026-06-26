import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading cart...
        </p>
      </main>
    );
  }

  const items = cart?.items || [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-700">CampusKart</p>
        <h1 className="text-2xl font-semibold text-slate-950">Your cart</h1>
      </div>

      {errorMessage && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Your cart is empty.
        </p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <section className="space-y-3">
            {items.map((item) => {
              const imageUrl = buildImageUrl(item.productImageUrl);

              return (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-[110px_1fr_auto]"
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.productTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-950">
                      {item.productTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Rs. {item.unitPrice} each
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-950">
                      Rs. {item.lineTotal}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      disabled={updatingItemId === item.id}
                      onChange={(event) =>
                        handleQuantityChange(item.id, Number(event.target.value))
                      }
                      className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:border-emerald-600"
                    />

                    <button
                      type="button"
                      disabled={updatingItemId === item.id}
                      onClick={() => handleRemove(item.id)}
                      className="rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-md border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold text-slate-950">
              Cart summary
            </h2>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-950">
                Rs. {cart.subtotal}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-5 block w-full rounded-md bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}