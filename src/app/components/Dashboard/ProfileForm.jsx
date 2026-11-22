"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "@/lib/action_api/profile";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  image: "",
};

const getAuthToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(error?.message || "Failed to get authentication token");
  }

  return data.token;
};

const validateForm = (form) => {
  const name = form.name.trim();

  if (!name) return "Name is required.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 80) return "Name cannot exceed 80 characters.";

  const phone = form.phone.trim();

  if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
    return "Enter a valid phone number (7-20 digits, spaces, +, - or parentheses).";
  }

  if (form.address.trim().length > 200) {
    return "Address cannot exceed 200 characters.";
  }

  const image = form.image.trim();

  if (image) {
    try {
      const url = new URL(image);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return "Profile image must be a valid http or https URL.";
    }
  }

  return "";
};

const ProfileForm = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const token = await getAuthToken();
        const result = await getProfile(token);

        if (cancelled) return;

        const user = result?.user ?? {};

        setProfile(user);
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          image: user.image || "",
        });
      } catch (loadError) {
        if (cancelled) return;

        console.error("Profile error:", loadError);
        setError(loadError.message || "Failed to load profile.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setError("");
    setSuccess("");
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    
    event.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      const message = "Please choose a JPG, PNG, WEBP or GIF image.";
      setError(message);
      toast.error(message);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const message = "Profile image must be 5 MB or smaller.";
      setError(message);
      toast.error(message);
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const token = await getAuthToken();
      const result = await uploadProfileImage(token, file);
      const image = result?.image || "";

      setForm((current) => ({ ...current, image }));
      setProfile((current) => (current ? { ...current, image } : current));

      const { error: sessionError } = await authClient.updateUser({ image });

      if (sessionError) {
        console.error("Session image update error:", sessionError);
      }

      const message = result?.message || "Profile image updated successfully.";
      setSuccess(message);
      toast.success(message);
      router.refresh();
    } catch (uploadError) {
      console.error("Profile image upload error:", uploadError);
      const message = uploadError.message || "Failed to upload profile image.";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((current) => ({ ...current, image: "" }));
    setError("");
    setSuccess("");
    toast.info("Profile image removed. Save changes to apply.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm(form);

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = await getAuthToken();
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        image: form.image.trim(),
      };

      const result = await updateProfile(token, payload);
      const updatedUser = result?.user;

      if (updatedUser) {
        setProfile(updatedUser);
        setForm({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          address: updatedUser.address || "",
          image: updatedUser.image || "",
        });
      } else {
        setProfile((current) => ({ ...current, ...payload }));
        setForm((current) => ({ ...current, ...payload }));
      }

      // Keep the Better Auth session cache in sync with the profile update.
      const { error: sessionError } = await authClient.updateUser({
        name: payload.name,
        image: payload.image,
      });

      if (sessionError) {
        console.error("Session update error:", sessionError);
      }

      const message = result?.message || "Profile updated successfully.";
      setSuccess(message);
      toast.success(message);
      router.refresh();
    } catch (updateError) {
      console.error("Profile update error:", updateError);
      const message = updateError.message || "Failed to update profile.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      image: profile?.image || "",
    });
    setError("");
    setSuccess("");
    toast.info("Unsaved profile changes were reset.");
  };

  if (loading) {
    return (
      <div className="p-5 md:p-8">
        <div className="max-w-2xl animate-pulse rounded-2xl border bg-white p-6">
          <div className="h-7 w-40 rounded bg-gray-200" />
          <div className="mt-6 h-24 w-24 rounded-full bg-gray-200" />
          <div className="mt-6 space-y-4">
            <div className="h-12 rounded-lg bg-gray-100" />
            <div className="h-12 rounded-lg bg-gray-100" />
            <div className="h-12 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-5 md:p-8">
        <div
          role="alert"
          className="max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700"
        >
          <h1 className="text-lg font-semibold">Unable to load profile</h1>
          <p className="mt-2 text-sm">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const avatar = form.image.trim();
  const initial = (form.name || profile?.email || "U").charAt(0).toUpperCase();
  const isBlocked = profile?.blocked === true;
  const role = profile?.role || "customer";

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and update your personal information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-5 border-b pb-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-gray-400">
                {initial}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="truncate text-lg font-semibold">
              {form.name || "Profile Information"}
            </h2>
            <p className="truncate text-sm text-gray-500">
              {form.email || "Manage your personal information."}
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {uploading ? "Uploading..." : "Upload Image"}
              </button>

              {avatar ? (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploading || saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="size-4" />
                  Remove
                </button>
              ) : null}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="mt-2 text-xs text-gray-400">
              JPG, PNG, WEBP or GIF up to 5 MB. You can also paste an image URL
              below.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Name <span className="text-rose-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
              maxLength={80}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <Mail className="size-3.5 text-gray-400" />
              Email
              <Lock className="size-3 text-gray-400" />
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              readOnly
              aria-readonly="true"
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              Email cannot be changed from your profile.
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <Phone className="size-3.5 text-gray-400" />
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              maxLength={20}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <MapPin className="size-3.5 text-gray-400" />
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              maxLength={200}
              placeholder="Your address (optional)"
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700"
            >
              <ImagePlus className="size-3.5 text-gray-400" />
              Profile Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
              maxLength={2048}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-gray-800">
              Account information
            </h3>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold capitalize text-gray-700">
              <UserRound className="size-3.5 text-rose-500" />
              Role: {role}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                isBlocked
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              Status: {isBlocked ? "Blocked" : "Active"}
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Role and account status are read-only. Only an administrator can
            change them.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            role="status"
            className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            {success}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={saving || uploading}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
