import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getMyProducts } from "../features/products/productApi";

function buildImageUrl(product) {
  const firstImage = product.images?.[0];

  if (!firstImage?.url) {
    return null;
  }

  if (firstImage.url.startsWith("http")) {
    return firstImage.url;
  }

  return `${import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"}${firstImage.url}`;
}

export function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadProducts() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getMyProducts();

      setProducts(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to load your products"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm("Delete this product listing?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to delete product"
      );
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">Seller</p>
          <h1 className="text-2xl font-semibold text-slate-950">
            My product listings
          </h1>
        </div>

        <Link
          to="/seller/products/new"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Add product
        </Link>
      </div>

      {isLoading && (
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading your products...
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && products.length === 0 && (
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          You have not created any products yet.
        </p>
      )}

      {!isLoading && !errorMessage && products.length > 0 && (
        <div className="grid gap-4">
          {products.map((product) => {
            const imageUrl = buildImageUrl(product);

            return (
              <div
                key={product.id}
                className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-[140px_1fr_auto]"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">
                      No image
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    {product.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    {product.campus}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    ₹{product.price}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">
                      {product.category}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">
                      {product.condition}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">
                      {product.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col">
                  <Link
                    to={`/products/${product.id}`}
                    className="rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View
                  </Link>
                  <Link
                   to={`/seller/products/${product.id}/edit`}
                  className="rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                  Edit
                  </Link>
                  <Link
                    to={`/seller/products/${product.id}/images`}
                    className="rounded-md border border-emerald-600 px-3 py-2 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Images
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}