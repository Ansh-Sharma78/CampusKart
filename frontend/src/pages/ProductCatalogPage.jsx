import { useEffect, useState } from "react";
import { PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import { getProducts } from "../features/products/productApi";
import { ProductCard } from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/ProductCardSkeleton";

const categories = [
  { label: "All", value: "" },
  { label: "Books", value: "BOOKS" },
  { label: "Notes", value: "NOTES" },
  { label: "Electronics", value: "ELECTRONICS" },
  { label: "Lab Equipment", value: "LAB_EQUIPMENT" },
  { label: "Cycles", value: "CYCLES" },
  { label: "Furniture", value: "FURNITURE" },
];

export function ProductCatalogPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
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

  const filteredProducts = products.filter((product) => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return [
      product.title,
      product.description,
      product.campus,
      product.category,
      product.condition,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword));
  });

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-300">
            Campus marketplace
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Browse student listings near you
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Discover books, gadgets, notes, furniture, cycles, and hostel
            essentials listed by students across your campus.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search products, campus, category..."
              className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
            <SlidersHorizontal size={17} aria-hidden="true" />
            {filteredProducts.length} listings
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const isActive = selectedCategory === category.value;

            return (
              <button
                key={category.label}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={[
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition",
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
                ].join(" ")}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && filteredProducts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <PackageSearch size={26} aria-hidden="true" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-950">
            No matching products
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Try a different search term or category filter.
          </p>
        </div>
      )}

      {!isLoading && !errorMessage && filteredProducts.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}