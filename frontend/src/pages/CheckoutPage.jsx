import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { getAddresses } from "../features/addresses/addressApi";
import { getCart } from "../features/cart/cartApi";
import { placeOrder } from "../features/orders/orderApi";

function CheckoutSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <div className="h-56 animate-pulse rounded-3xl bg-slate-200" />
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
      </div>

      <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadCheckoutData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [cartResponse, addressesResponse] = await Promise.all([
        getCart(),
        getAddresses(),
      ]);

      const cartData = cartResponse.data.data;
      const addressData = addressesResponse.data.data;

      setCart(cartData);
      setAddresses(addressData);

      const defaultAddress = addressData.find(
        (address) => address.defaultAddress
      );

      if (defaultAddress) {
        setSelectedAddressId(String(defaultAddress.id));
      } else if (addressData.length > 0) {
        setSelectedAddressId(String(addressData[0].id));
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to load checkout"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      setErrorMessage("Please select a delivery address");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setErrorMessage("");

      const response = await placeOrder({
        addressId: Number(selectedAddressId),
      });

      const createdOrder = response.data.data;

      navigate(`/orders/${createdOrder.id}`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to place order"
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const cartItems = cart?.items || [];

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-300">
              Checkout
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Confirm your order
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Select a delivery address and place your campus marketplace
              order.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15">
            <p className="text-sm text-slate-300">Cart items</p>
            <p className="text-2xl font-black">{cartItems.length}</p>
          </div>
        </div>
      </div>

      {isLoading && <CheckoutSkeleton />}

      {!isLoading && errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {!isLoading && cartItems.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
            <PackageSearch size={30} aria-hidden="true" />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-950">
            Nothing to checkout
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add products to your cart before placing an order.
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

      {!isLoading && cartItems.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <MapPin size={22} aria-hidden="true" />
                </div>

                <div>
                  <h2 className="font-black text-slate-950">
                    Delivery address
                  </h2>
                  <p className="text-sm text-slate-500">
                    Choose where this order should be delivered
                  </p>
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                  <p className="text-sm font-semibold text-slate-600">
                    Add a delivery address before placing an order.
                  </p>

                  <Link
                    to="/addresses"
                    className="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
                  >
                    Add address
                  </Link>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {addresses.map((address) => {
                    const isSelected =
                      selectedAddressId === String(address.id);

                    return (
                      <label
                        key={address.id}
                        className={[
                          "block cursor-pointer rounded-2xl border p-4 transition",
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-100"
                            : "border-slate-200 bg-white hover:border-emerald-300",
                        ].join(" ")}
                      >
                        <div className="flex gap-3">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={isSelected}
                            onChange={(event) =>
                              setSelectedAddressId(event.target.value)
                            }
                            className="mt-1 h-4 w-4 accent-emerald-700"
                          />

                          <span>
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-black text-slate-950">
                                {address.recipientName}
                              </span>

                              {address.defaultAddress && (
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                                  Default
                                </span>
                              )}
                            </span>

                            <span className="mt-1 block text-sm font-medium text-slate-500">
                              {address.phoneNumber}
                            </span>

                            <span className="mt-3 block text-sm leading-6 text-slate-700">
                              {address.line1}
                              {address.line2 ? `, ${address.line2}` : ""}
                              <br />
                              {address.city}, {address.state} -{" "}
                              {address.postalCode}
                              <br />
                              {address.campus}
                            </span>
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <ShoppingBag size={22} aria-hidden="true" />
                </div>

                <div>
                  <h2 className="font-black text-slate-950">Order items</h2>
                  <p className="text-sm text-slate-500">
                    {cartItems.length} item(s)
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-black text-slate-950">
                        {item.productTitle}
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Qty {item.quantity} x Rs. {item.unitPrice}
                      </p>
                    </div>

                    <p className="font-black text-emerald-700">
                      Rs. {item.lineTotal}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CreditCard size={22} aria-hidden="true" />
              </div>

              <div>
                <h2 className="font-black text-slate-950">Order summary</h2>
                <p className="text-sm text-slate-500">Payment comes next</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-black text-slate-950">
                  Rs. {cart.subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className="font-bold text-emerald-700">
                  Campus pickup
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="font-black text-slate-950">Total</span>
                <span className="font-black text-slate-950">
                  Rs. {cart.subtotal}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={
                isPlacingOrder || addresses.length === 0 || cartItems.length === 0
              }
              onClick={handlePlaceOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              {isPlacingOrder ? "Placing order..." : "Place order"}
            </button>

            <Link
              to="/cart"
              className="mt-3 block text-center text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              Back to cart
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}