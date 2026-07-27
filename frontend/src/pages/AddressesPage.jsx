import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Home,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../features/addresses/addressApi";

const emptyForm = {
  recipientName: "",
  phoneNumber: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  campus: "",
  defaultAddress: false,
};

function AddressSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-10 w-48 animate-pulse rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

function Field({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
    />
  );
}

export function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadAddresses() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getAddresses();

      setAddresses(response.data.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to load addresses"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function updateField(fieldName, value) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value,
    }));
  }

  function startEdit(address) {
    setEditingAddressId(address.id);
    setFormData({
      recipientName: address.recipientName,
      phoneNumber: address.phoneNumber,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      campus: address.campus,
      defaultAddress: address.defaultAddress,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingAddressId(null);
    setFormData(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (editingAddressId) {
        await updateAddress(editingAddressId, formData);
      } else {
        await createAddress(formData);
      }

      resetForm();
      await loadAddresses();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to save address"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(addressId) {
    const confirmed = window.confirm("Delete this address?");

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");

      await deleteAddress(addressId);
      await loadAddresses();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to delete address"
      );
    }
  }

  async function handleSetDefault(addressId) {
    try {
      setErrorMessage("");

      await setDefaultAddress(addressId);
      await loadAddresses();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to set default address"
      );
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-300">
              Delivery addresses
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Manage campus delivery points
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Add hostel, department, library, or campus pickup addresses for
              faster checkout.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15">
            <p className="text-sm text-slate-300">Saved addresses</p>
            <p className="text-2xl font-black">{addresses.length}</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              {editingAddressId ? (
                <Pencil size={22} aria-hidden="true" />
              ) : (
                <Plus size={22} aria-hidden="true" />
              )}
            </div>

            <div>
              <h2 className="font-black text-slate-950">
                {editingAddressId ? "Edit address" : "Add new address"}
              </h2>
              <p className="text-sm text-slate-500">
                Used during checkout
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Field
              value={formData.recipientName}
              onChange={(event) =>
                updateField("recipientName", event.target.value)
              }
              placeholder="Recipient name"
            />

            <Field
              value={formData.phoneNumber}
              onChange={(event) =>
                updateField("phoneNumber", event.target.value)
              }
              placeholder="Phone number"
            />

            <Field
              value={formData.line1}
              onChange={(event) => updateField("line1", event.target.value)}
              placeholder="Address line 1"
            />

            <Field
              value={formData.line2}
              onChange={(event) => updateField("line2", event.target.value)}
              placeholder="Address line 2"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                value={formData.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="City"
              />

              <Field
                value={formData.state}
                onChange={(event) => updateField("state", event.target.value)}
                placeholder="State"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                value={formData.postalCode}
                onChange={(event) =>
                  updateField("postalCode", event.target.value)
                }
                placeholder="Postal code"
              />

              <Field
                value={formData.campus}
                onChange={(event) => updateField("campus", event.target.value)}
                placeholder="Campus"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.defaultAddress}
                onChange={(event) =>
                  updateField("defaultAddress", event.target.checked)
                }
                className="h-4 w-4 accent-emerald-700"
              />
              Set as default address
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <CheckCircle2 size={17} aria-hidden="true" />
                {isSubmitting
                  ? "Saving..."
                  : editingAddressId
                    ? "Update address"
                    : "Add address"}
              </button>

              {editingAddressId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          {isLoading ? (
            <AddressSkeleton />
          ) : addresses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                <MapPin size={30} aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-950">
                No addresses saved
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add your hostel, classroom block, or campus pickup point to
                checkout faster.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <article
                  key={address.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <Home size={23} aria-hidden="true" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-black text-slate-950">
                            {address.recipientName}
                          </h2>

                          {address.defaultAddress && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                              <Star size={12} aria-hidden="true" />
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {address.phoneNumber}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ""}
                          <br />
                          {address.city}, {address.state} -{" "}
                          {address.postalCode}
                          <br />
                          {address.campus}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {!address.defaultAddress && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                        >
                          <Star size={15} aria-hidden="true" />
                          Default
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => startEdit(address)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil size={15} aria-hidden="true" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(address.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}