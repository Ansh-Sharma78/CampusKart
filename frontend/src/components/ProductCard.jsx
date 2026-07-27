import { Link } from "react-router-dom";
import { MapPin, PackageCheck } from "lucide-react";

function getProductImageUrl(product) {
  const firstImage = product.images?.[0];
  const rawImageUrl = firstImage?.imageUrl || firstImage?.url;

  if (!rawImageUrl) {
    return null;
  }

  if (rawImageUrl.startsWith("http")) {
    return rawImageUrl;
  }

  return `${import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"}${rawImageUrl}`;
}

function formatPrice(price) {
  return `Rs. ${price}`;
}

export function ProductCard({ product }) {
  const imageUrl = getProductImageUrl(product);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-500">
            No image
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
          {product.category}
        </span>

        {product.status && (
          <span className="absolute right-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-white">
            {product.status}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 min-h-[44px] text-base font-semibold leading-snug text-slate-950 group-hover:text-emerald-700">
            {product.title}
          </h2>

          <p className="shrink-0 text-base font-bold text-emerald-700">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={15} aria-hidden="true" />
          <span className="line-clamp-1">{product.campus}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <PackageCheck size={13} aria-hidden="true" />
            {product.condition}
          </span>

          {product.quantity !== undefined && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Qty {product.quantity}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}