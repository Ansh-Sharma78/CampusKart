import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../features/products/productApi";

function buildImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  return `${import.meta.env.VITE_BACKEND_ORIGIN}${imageUrl}`;
}

export function ProductDetailPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const imageUrls = useMemo(() => {
    return product?.images?.map((image) => buildImageUrl(image.url)) || [];
  }, [product]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getProductById(productId);
        const loadedProduct = response.data.data;

        setProduct(loadedProduct);
        setSelectedImageUrl(buildImageUrl(loadedProduct.images?.[0]?.url) || "");
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

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading product...
        </p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to="/products"
        className="mb-4 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <div className="aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-slate-100">
            {selectedImageUrl ? (
              <img
                src={selectedImageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No image available
              </div>
            )}
          </div>

          {imageUrls.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {imageUrls.map((imageUrl) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setSelectedImageUrl(imageUrl)}
                  className={`aspect-square overflow-hidden rounded-md border bg-slate-100 ${
                    selectedImageUrl === imageUrl
                      ? "border-emerald-600"
                      : "border-slate-200"
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              {product.category}
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-950">
              {product.title}
            </h1>
          </div>

          <p className="text-2xl font-semibold text-slate-950">
            ₹{product.price}
          </p>

          <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <p className="font-medium text-slate-950">Condition</p>
              <p>{product.condition}</p>
            </div>

            <div>
              <p className="font-medium text-slate-950">Campus</p>
              <p>{product.campus}</p>
            </div>

            <div>
              <p className="font-medium text-slate-950">Quantity</p>
              <p>{product.quantity}</p>
            </div>

            <div>
              <p className="font-medium text-slate-950">Seller</p>
              <p>{product.sellerName}</p>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
              {product.description}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}