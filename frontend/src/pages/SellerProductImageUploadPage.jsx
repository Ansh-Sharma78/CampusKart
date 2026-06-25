import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { uploadProductImage } from "../features/products/productApi";

export function SellerProductImageUploadPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setSelectedFile(file || null);
    setSuccessMessage("");
    setErrorMessage("");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please select an image first");
      return;
    }

    try {
      setIsUploading(true);
      setSuccessMessage("");
      setErrorMessage("");

      await uploadProductImage(productId, selectedFile);

      setSuccessMessage("Image uploaded successfully");
      setSelectedFile(null);
      setPreviewUrl("");

      navigate(`/products/${productId}`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to={`/products/${productId}`}
        className="mb-4 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        Back to product
      </Link>

      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-700">Seller</p>
        <h1 className="text-2xl font-semibold text-slate-950">
          Upload product image
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-md border border-slate-200 bg-white p-5"
      >
        {successMessage && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Product image
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600"
          />
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-100">
            <img
              src={previewUrl}
              alt="Selected product"
              className="max-h-80 w-full object-contain"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isUploading ? "Uploading..." : "Upload image"}
        </button>
      </form>
    </main>
  );
}