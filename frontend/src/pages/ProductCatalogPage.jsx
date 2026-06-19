import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../features/products/productApi";

const categories = [
  { label: "All", value: "" },
  { label: "Books", value: "BOOKS" },
  { label: "Notes", value: "NOTES" },
  { label: "Electronics", value: "ELECTRONICS" },
  { label: "Lab Equipment", value: "LAB_EQUIPMENT" },
  { label: "Cycles", value: "CYCLES" },
  { label: "Furniture", value: "FURNITURE" },
];

function getImageUrl(product) {
  const firstImage = product.images?.[0];

  if (!firstImage?.imageUrl) {
    return null;
  }

  // TODO: Use import.meta.env.VITE_BACKEND_ORIGIN from .env file
  // For now, hardcode localhost:8080 for development
  const origin = 'http://localhost:8080';
  return `${origin}${firstImage.imageUrl}`;
}

export function ProductCatalogPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getProducts(selectedCategory);

        setProducts(response.data.data);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Unable to load products"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">CampusKart</p>
          <h1 className="text-2xl font-semibold text-slate-950">
            Browse campus listings
          </h1>
        </div>

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 sm:w-56"
        >
          {categories.map((category) => (
            <option key={category.label} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading products...
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && products.length === 0 && (
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No products found.
        </p>
      )}

      {!isLoading && !errorMessage && products.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const imageUrl = getImageUrl(product);

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="overflow-hidden rounded-md border border-slate-200 bg-white transition hover:border-emerald-500 hover:shadow-sm"
              >
                <div className="aspect-[4/3] bg-slate-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 text-base font-semibold text-slate-950">
                      {product.title}
                    </h2>

                    <p className="shrink-0 text-sm font-semibold text-emerald-700">
                      ₹{product.price}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600">{product.campus}</p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">
                      {product.category}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">
                      {product.condition}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}