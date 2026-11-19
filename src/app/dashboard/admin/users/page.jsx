
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Eye,
  Ban,
  CheckCircle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const getToken = async () => {
    const result = await authClient.token();
    return result?.data?.token;
  };

  const apiRequest = async (path, options = {}) => {
    const token = await getToken();

    if (!token) {
      throw new Error("Authentication token পাওয়া যায়নি");
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/admin/users");
      setUsers(data.users || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (user) => {
    const action = user.blocked ? "unblock" : "block";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);

      await apiRequest(`/admin/users/${user._id}/${action}`, {
        method: "PATCH",
      });

      await fetchUsers();

      if (selectedUser?._id === user._id) {
        setSelectedUser({
          ...selectedUser,
          blocked: !user.blocked,
        });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-sm text-gray-500">
            View and manage all registered customers.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 rounded-lg border px-4 py-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Total Customers</p>
          <h2 className="mt-2 text-2xl font-bold">{users.length}</h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Active Customers</p>
          <h2 className="mt-2 text-2xl font-bold">
            {users.filter((user) => !user.blocked).length}
          </h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Blocked Customers</p>
          <h2 className="mt-2 text-2xl font-bold">
            {users.filter((user) => user.blocked).length}
          </h2>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Registered</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4 font-medium">
                  {user.name || "Unknown"}
                </td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      user.blocked
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="p-4">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>

                <td className="flex items-center gap-2 p-4">
                  <button
                    onClick={() => setSelectedUser(user)}
                    title="View Details"
                    className="rounded-lg border p-2"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    disabled={actionLoading === user._id}
                    onClick={() => handleBlockToggle(user)}
                    className={`rounded-lg px-3 py-2 text-white disabled:opacity-50 ${
                      user.blocked ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {actionLoading === user._id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : user.blocked ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle size={15} />
                        Unblock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Ban size={15} />
                        Block
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl dark:bg-gray-900 dark:text-white">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Customer Details</h2>
              <button onClick={() => setSelectedUser(null)}>
                <X size={22} />
              </button>
            </div>

            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedUser.name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedUser.blocked ? "Blocked" : "Active"}
              </p>
              <p>
                <strong>Registered:</strong>{" "}
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-lg bg-gray-900 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
