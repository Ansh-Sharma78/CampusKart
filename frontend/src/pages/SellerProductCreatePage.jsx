import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../features/products/productApi";

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

const initialFormState = {
  title: "",
  description: "",
  category: "BOOKS",
  condition: "GOOD",
  price: "",
  campus: "",
  quantity: "1",
};

export function SellerProductCreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(fieldName, value) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value,
    }));
  }

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

      const response = await createProduct(payload);
      const createdProduct = response.data.data;

      navigate(`/products/${createdProduct.id}`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-700">Seller</p>
        <h1 className="text-2xl font-semibold text-slate-950">
          Create product listing
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            value={formData.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Engineering Mathematics Book"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            rows={5}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Describe condition, usage, pickup details..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(event) => updateField("condition", event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
            >
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Price
            </label>
            <input
              type="number"
              min="1"
              value={formData.price}
              onChange={(event) => updateField("price", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
              placeholder="250"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(event) => updateField("quantity", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Campus
          </label>
          <input
            value={formData.campus}
            onChange={(event) => updateField("campus", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Main Campus"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Creating..." : "Create listing"}
        </button>
      </form>
    </main>
  );
}