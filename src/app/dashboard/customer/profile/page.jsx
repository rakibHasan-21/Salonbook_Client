"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/lib/action_api/profile";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  image: "",
};

const getAuthToken = async () => {
  const { data, error } = await authClient.$fetch("/token");

  if (error || !data?.token) {
    throw new Error(error?.message || "Failed to get authentication token");
  }

  return data.token;
};

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const token = await getAuthToken();
        const result = await getCustomerProfile(token);

        if (cancelled) return;

        const user = result?.user ?? result ?? {};

        setProfile(user);
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          image: user.image || "",
        });
      } catch (error) {
        if (cancelled) return;

        console.error("Profile Error:", error);
        setError(error.message || "Failed to load profile.");
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();
    const image = form.image.trim();

    if (!name) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = await getAuthToken();
      const result = await updateCustomerProfile(token, {
        name,
        phone,
        image,
      });

      const updatedProfile = {
        ...profile,
        name,
        phone,
        image,
      };

      setProfile(updatedProfile);
      setForm((current) => ({
        ...current,
        name,
        phone,
        image,
      }));

      // Keep the Better Auth session cache in sync with the profile update.
      const { error: sessionError } = await authClient.updateUser({
        name,
        image,
      });

      if (sessionError) {
        console.error("Session update error:", sessionError);
      }

      const message = result?.message || "Profile updated successfully.";
      setSuccess(message);
      toast.success(message);
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      const message = error.message || "Failed to update profile.";
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
      image: profile?.image || "",
    });
    setError("");
    setSuccess("");
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
            className="mt-5 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const avatar = form.image || profile?.image;

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and update your profile information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-4 border-b pb-6 sm:flex-row">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl text-gray-400">👤</span>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold">
              {form.name || "Profile Information"}
            </h2>
            <p className="text-sm text-gray-500">
              {form.email || "Manage your personal information."}
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
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
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
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Profile Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {success}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
