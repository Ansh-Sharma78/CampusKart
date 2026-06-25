import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../features/products/productApi";

const categories = [
  "BOOKS",
  "NOTES",
  "ELECTRONICS",
  "LAB_EQUIPMENT",
  "CYCLES",
  "HOSTEL_UTENSILS",
  "FURNITURE",
  "STUDY_RESOURCES",
  "OTHER",
];

const conditions = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "USED"];

const statuses = ["ACTIVE", "SOLD_OUT", "INACTIVE"];

export function SellerProductEditPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(fieldName, value) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value,
    }));
  }

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getProductById(productId);
        const product = response.data.data;

        setFormData({
          title: product.title,
          description: product.description,
          category: product.category,
          condition: product.condition,
          price: String(product.price),
          campus: product.campus,
          quantity: String(product.quantity),
          status: product.status,
        });
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };

      await updateProduct(productId, payload);

      navigate(`/products/${productId}`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to update product"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading product...
        </p>
      </main>
    );
  }

  if (!formData) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage || "Product not found"}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/seller/products"
        className="mb-4 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        Back to my products
      </Link>

      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-700">Seller</p>
        <h1 className="text-2xl font-semibold text-slate-950">
          Edit product listing
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-md border border-slate-200 bg-white p-5"
      >
        {errorMessage && (
          <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <input
          value={formData.title}
          onChange={(event) => updateField("title", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          placeholder="Title"
        />

        <textarea
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={5}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          placeholder="Description"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={formData.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={formData.condition}
            onChange={(event) => updateField("condition", event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="number"
            min="1"
            value={formData.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Price"
          />

          <input
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(event) => updateField("quantity", event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Quantity"
          />
        </div>

        <input
          value={formData.campus}
          onChange={(event) => updateField("campus", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          placeholder="Campus"
        />

        <select
          value={formData.status}
          onChange={(event) => updateField("status", event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Updating..." : "Update listing"}
        </button>
      </form>
    </main>
  );
}