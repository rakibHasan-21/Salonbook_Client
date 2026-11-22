"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Scissors,
  Search,
  Trash2,
  Upload,
  Wallet,
  X,
} from "lucide-react";

import {
  createAdminService,
  deleteAdminService,
  getAdminServices,
  updateAdminService,
  updateAdminServiceStatus,
} from "@/lib/action_api/admin-services";
import { LoadingMessage } from "@/components/shared/LoadingState";
import { confirmAction } from "@/lib/confirm";
import {
  getErrorMessage,
  isBlockedError,
  isForbiddenError,
  isUnauthorizedError,
} from "@/lib/api";

const emptyForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  status: "active", // default Active
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500";

const buildForm = (service) => ({
  serviceName: service?.serviceName || "",
  category: service?.category || "",
  description: service?.description || "",
  price: service?.price ?? "",
  duration: service?.duration ?? "",
  status: service?.status === "inactive" ? "inactive" : "active",
});

export default function ManageServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("default");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [busyId, setBusyId] = useState(null);

  const redirectIfAuthError = useCallback(
    (err) => {
      if (isUnauthorizedError(err)) {
        const message = "Your session has expired. Please sign in again.";
        toast.error(message);
        router.push(`/sign-in?error=${encodeURIComponent(message)}`);
        return true;
      }

      if (isBlockedError(err)) {
        const message =
          "Your account has been blocked. Please contact the administrator.";
        toast.error(message);
        router.push("/blocked");
        return true;
      }

      if (isForbiddenError(err)) {
        const message = "You do not have permission to manage services.";
        toast.error(message);
        router.push(
          `/unauthorized?reason=admin&error=${encodeURIComponent(message)}`
        );
        return true;
      }

      return false;
    },
    [router]
  );

  const showFormError = (message) => {
    setFormError(message);
    toast.error(message);
  };

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminServices();
      setServices(data);
      toast.success("Services refreshed successfully.");
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(err, "Failed to load services.");
      setError(message);
      if (!redirectIfAuthError(err)) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, [redirectIfAuthError]);

  useEffect(() => {
    let cancelled = false;

    const loadInitialServices = async () => {
      try {
        const data = await getAdminServices();

        if (!cancelled) {
          setServices(data);
        }
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        const message = getErrorMessage(err, "Failed to load services.");
        setError(message);
        if (!redirectIfAuthError(err)) {
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialServices();

    return () => {
      cancelled = true;
    };
  }, [redirectIfAuthError]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 4000);

    return () => clearTimeout(timer);
  }, [notice]);

  // Cleanup blob preview URL
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const counts = useMemo(
    () => ({
      total: services.length,
      active: services.filter((service) => service.status === "active").length,
      inactive: services.filter((service) => service.status !== "active")
        .length,
    }),
    [services]
  );

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = services.filter((service) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"
          ? service.status === "active"
          : service.status !== "active");

      const matchesSearch =
        !term ||
        [service.serviceName, service.category, service.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));

      return matchesStatus && matchesSearch;
    });

    if (sort === "price-asc" || sort === "low-to-high") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-desc" || sort === "high-to-low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [services, search, statusFilter, sort]);

  const resetImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    resetImage();
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (service) => {
    setEditingId(service._id);
    setForm(buildForm(service));
    setImageFile(null);
    setImagePreview(service.image || ""); // existing image
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    resetImage();
    setFormError("");
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showFormError("Please select a valid image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      showFormError("Image must be 5MB or smaller.");
      return;
    }

    setFormError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    event.target.value = ""; // allow re-selecting the same file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const serviceName = form.serviceName.trim();
    const category = form.category.trim();
    const price = Number(form.price);
    const duration = Number(form.duration);

    if (!serviceName) {
      showFormError("Service name is required.");
      return;
    }

    if (!category) {
      showFormError("Category is required.");
      return;
    }

    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      showFormError("Enter a valid price (0 or more).");
      return;
    }

    if (form.duration === "" || !Number.isFinite(duration) || duration <= 0) {
      showFormError("Enter a valid duration greater than 0.");
      return;
    }

    if (!editingId && !imageFile) {
      showFormError("Please upload a service image.");
      return;
    }

    const payload = new FormData();
    payload.append("serviceName", serviceName);
    payload.append("category", category);
    payload.append("description", form.description.trim());
    payload.append("price", String(price));
    payload.append("duration", String(duration));
    payload.append("status", form.status);

    if (imageFile) {
      payload.append("image", imageFile);
    } else if (editingId && !imagePreview) {
      payload.append("removeImage", "true"); // user removed existing image
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingId) {
        const body = await updateAdminService(editingId, payload);
        const updated = body?.service;

        if (updated) {
          setServices((previous) =>
            previous.map((service) =>
              service._id === editingId ? updated : service
            )
          );
        }

        setNotice("Service updated successfully.");
        toast.success("Service updated successfully.");
      } else {
        const body = await createAdminService(payload);
        const created = body?.service;

        if (created) {
          setServices((previous) => [created, ...previous]);
        }

        setNotice("Service added successfully.");
        toast.success("Service added successfully.");
      }

      setFormOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      resetImage();
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(err, "Failed to save service.");
      setFormError(message);
      if (!redirectIfAuthError(err)) {
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (service) => {
    const nextStatus = service.status === "active" ? "inactive" : "active";

    try {
      setBusyId(service._id);
      setError("");

      const body = await updateAdminServiceStatus(service._id, nextStatus);
      const updated = body?.service;

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? updated || { ...item, status: nextStatus }
            : item
        )
      );

      const successMessage =
        nextStatus === "active"
          ? "Service activated successfully."
          : "Service deactivated successfully.";

      setNotice(successMessage);
      toast.success(successMessage);
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(err, "Failed to update service status.");
      setError(message);
      if (!redirectIfAuthError(err)) {
        toast.error(message);
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (service) => {
    const confirmed = await confirmAction({
      title: `Delete "${service.serviceName}"?`,
      description:
        "This permanently removes the service from the catalogue. This action cannot be undone.",
      confirmLabel: "Delete service",
      cancelLabel: "Keep service",
      tone: "danger",
    });

    if (!confirmed) return;

    try {
      setBusyId(service._id);
      setError("");

      await deleteAdminService(service._id);

      setServices((previous) =>
        previous.filter((item) => item._id !== service._id)
      );

      setNotice("Service deleted successfully.");
      toast.success("Service deleted successfully.");
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(err, "Failed to delete service.");
      setError(message);
      if (!redirectIfAuthError(err)) {
        toast.error(message);
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
                Admin Panel
              </p>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Manage Services
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Add, edit, activate or remove salon services. Only active
              services appear on the public site.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadServices}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              <Plus size={17} />
              Add New Service
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Services", value: counts.total, tone: "text-slate-900" },
            { label: "Active", value: counts.active, tone: "text-emerald-600" },
            { label: "Inactive", value: counts.inactive, tone: "text-slate-500" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {item.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${item.tone}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={19} />
            <div className="flex-1">
              <p className="font-semibold text-red-800">Something went wrong</p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 transition hover:text-red-600"
              aria-label="Dismiss error"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {notice && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <CheckCircle2
              className="mt-0.5 shrink-0 text-emerald-600"
              size={19}
            />
            <p className="text-sm font-medium text-emerald-700">{notice}</p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, category or description..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ].map((option) => {
              const active = statusFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort services by price"
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Services table */}
        {loading && (
          <LoadingMessage
            title="Loading services"
            description="Fetching the salon service catalogue..."
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          />
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Service</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Duration</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-4" colSpan={6}>
                          <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                        </td>
                      </tr>
                    ))
                  : filteredServices.map((service) => {
                      const isActive = service.status === "active";
                      const busy = busyId === service._id;

                      return (
                        <tr
                          key={service._id}
                          className="transition hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-rose-50">
                                {service.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={service.image}
                                    alt={service.serviceName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Scissors size={20} className="text-rose-400" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900">
                                  {service.serviceName}
                                </p>
                                <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-slate-500">
                                  {service.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {service.category || "Uncategorized"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                              <Wallet size={15} className="text-slate-400" />
                              ${service.price}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 text-slate-600">
                              <Clock size={15} className="text-slate-400" />
                              {service.duration} min
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                isActive
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-100 text-slate-500"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isActive ? "bg-emerald-500" : "bg-slate-400"
                                }`}
                              />
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(service)}
                                disabled={busy}
                                title="Edit service"
                                aria-label={`Edit ${service.serviceName}`}
                                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(service)}
                                disabled={busy}
                                title={
                                  isActive
                                    ? "Deactivate service"
                                    : "Activate service"
                                }
                                aria-label={`${
                                  isActive ? "Deactivate" : "Activate"
                                } ${service.serviceName}`}
                                className={`rounded-lg border p-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  isActive
                                    ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                }`}
                              >
                                {busy ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Power size={16} />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(service)}
                                disabled={busy}
                                title="Delete service"
                                aria-label={`Delete ${service.serviceName}`}
                                className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {!loading && filteredServices.length === 0 && (
            <div className="border-t border-slate-100 px-5 py-16 text-center">
              <Scissors className="mx-auto text-rose-300" size={40} />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No services found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {services.length === 0
                  ? "Add your first service to get started."
                  : "Try a different search or status filter."}
              </p>

              {services.length === 0 && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  <Plus size={16} />
                  Add New Service
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-form-title"
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2
                  id="service-form-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {editingId ? "Edit Service" : "Add New Service"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingId
                    ? "Update the service details below."
                    : "Fill in the details to publish a new service."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="serviceName" className={labelClass}>
                    Service Name *
                  </label>
                  <input
                    id="serviceName"
                    type="text"
                    value={form.serviceName}
                    onChange={handleChange("serviceName")}
                    placeholder="e.g. Premium Haircut & Styling"
                    className={inputClass}
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="category" className={labelClass}>
                    Service Category *
                  </label>
                  <input
                    id="category"
                    type="text"
                    value={form.category}
                    onChange={handleChange("category")}
                    placeholder="e.g. Hair Care"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="price" className={labelClass}>
                    Price (USD) *
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange("price")}
                    placeholder="35"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="duration" className={labelClass}>
                    Estimated Duration (in minutes) *
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    step="1"
                    value={form.duration}
                    onChange={handleChange("duration")}
                    placeholder="45"
                    className={inputClass}
                  />
                </div>

                {/* Image upload */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Service Image {!editingId && "*"}
                  </label>

                  {imagePreview ? (
                    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Service preview"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {imageFile ? imageFile.name : "Current image"}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <label
                            htmlFor="image"
                            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={resetImage}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="image"
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center transition hover:border-rose-300 hover:bg-rose-50/40"
                    >
                      <Upload size={22} className="text-rose-500" />
                      <span className="text-sm font-semibold text-slate-700">
                        Click to upload image
                      </span>
                      <span className="text-xs text-slate-400">
                        PNG, JPG, WEBP up to 5MB
                      </span>
                    </label>
                  )}

                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange("description")}
                    placeholder="Describe what this service includes..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>

                <div>
                  <label htmlFor="status" className={labelClass}>
                    Service Status
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={handleChange("status")}
                    className={inputClass}
                  >
                    <option value="active">Active (visible publicly)</option>
                    <option value="inactive">
                      Inactive (hidden from public)
                    </option>
                  </select>
                </div>

                {formError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:col-span-2">
                    <AlertCircle
                      className="mt-0.5 shrink-0 text-red-600"
                      size={17}
                    />
                    <p className="text-sm font-medium text-red-700">
                      {formError}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? "Save Changes" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}