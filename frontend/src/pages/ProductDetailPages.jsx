import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Store,
} from "lucide-react";
import { addCartItem } from "../features/cart/cartApi";
import { getProductById } from "../features/products/productApi";

function buildImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"}${imageUrl}`;
}

function getProductImageUrls(product) {
  return (
    product?.images
      ?.map((image) => image.imageUrl || image.url)
      .filter(Boolean)
      .map(buildImageUrl) || []
  );
}

export function ProductDetailPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const imageUrls = useMemo(() => getProductImageUrls(product), [product]);

  const canAddToCart =
    product?.status === "ACTIVE" && product?.quantity > 0 && quantity > 0;

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getProductById(productId);
        const loadedProduct = response.data.data;
        const loadedImageUrls = getProductImageUrls(loadedProduct);

        setProduct(loadedProduct);
        setSelectedImageUrl(loadedImageUrls[0] || "");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Unable to load product"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  async function handleAddToCart() {
    if (!canAddToCart) {
      return;
    }

    try {
      setIsAddingToCart(true);
      setCartMessage("");
      setCartError("");

      await addCartItem({
        productId: Number(productId),
        quantity,
      });

      setCartMessage("Added to cart successfully.");
    } catch (error) {
      setCartError(error.response?.data?.message || "Unable to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  }

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-200" />

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
            <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-24 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
        {errorMessage}
      </section>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <section className="space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[4/3] bg-slate-100">
              {selectedImageUrl ? (
                <img
                  src={selectedImageUrl}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
                  No image available
                </div>
              )}
            </div>
          </div>

          {imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {imageUrls.map((imageUrl) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setSelectedImageUrl(imageUrl)}
                  className={[
                    "aspect-square overflow-hidden rounded-2xl border bg-white p-1 transition",
                    selectedImageUrl === imageUrl
                      ? "border-emerald-600 ring-4 ring-emerald-100"
                      : "border-slate-200 hover:border-emerald-300",
                  ].join(" ")}
                >
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full rounded-xl object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {product.category}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {product.condition}
              </span>

              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                {product.status}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-3xl font-black text-emerald-700">
              Rs. {product.price}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <MapPin size={17} className="text-emerald-700" />
                  Campus
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {product.campus}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <Store size={17} className="text-emerald-700" />
                  Seller
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {product.sellerName}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <PackageCheck size={17} className="text-emerald-700" />
                  Available
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {product.quantity} item(s)
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <ShieldCheck size={17} className="text-emerald-700" />
                  Campus deal
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Student marketplace listing
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label
                htmlFor="quantity"
                className="text-sm font-bold text-slate-950"
              >
                Quantity
              </label>

              <div className="mt-2 flex gap-3">
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(Number(event.target.value))
                  }
                  className="h-11 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !canAddToCart}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  <ShoppingCart size={18} aria-hidden="true" />
                  {isAddingToCart ? "Adding..." : "Add to cart"}
                </button>
              </div>

              {cartMessage && (
                <p className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {cartMessage}
                </p>
              )}

              {cartError && (
                <p className="mt-3 text-sm font-bold text-red-700">
                  {cartError}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Product description
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {product.description}
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}