
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Receipt,
  RefreshCw,
  Search,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { LoadingMessage } from "@/components/shared/LoadingState";
import {
  ApiError,
  apiFetch,
  getErrorMessage,
  isBlockedError,
  isForbiddenError,
  isUnauthorizedError,
} from "@/lib/api";

// const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const getToken = async () => {
  const result = await authClient.token();
  return result?.data?.token;
};

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

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
        const message = "You do not have permission to view transactions.";
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

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new ApiError("Transactions API is not configured.", {
          code: "CONFIG",
        });
      }

      const token = await getToken();

      if (!token) {
        throw new ApiError("Your session has expired. Please sign in again.", {
          status: 401,
          code: "UNAUTHORIZED",
        });
      }

      const data = await apiFetch(`${API_URL}/admin/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      setTransactions(data?.transactions || []);
    } catch (error) {
      console.error("Transactions error:", error);
      const message = getErrorMessage(
        error,
        "Unable to load transactions. Please try again."
      );
      setError(message);
      if (!redirectIfAuthError(error)) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, [redirectIfAuthError]);

  useEffect(() => {
    // Initial load only. fetchTransactions manages its own loading/error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions
    .filter((item) => {
      const searchText = search.toLowerCase();

      return (
        item.customerName?.toLowerCase().includes(searchText) ||
        item.customerEmail?.toLowerCase().includes(searchText) ||
        item.serviceName?.toLowerCase().includes(searchText) ||
        item.stripeSessionId?.toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      const getAmount = (item) =>
        Number(item.paymentAmount ?? item.amount ?? item.price ?? 0);

      if (sort === "price-asc") return getAmount(a) - getAmount(b);
      if (sort === "price-desc") return getAmount(b) - getAmount(a);

      return 0;
    });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "succeeded":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "pending":
      case "unpaid":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-4">
        <LoadingMessage
          title="Loading transactions"
          description="Fetching customer payment records..."
          className="rounded-2xl border bg-white px-6 py-8 shadow-sm"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            View all customer payment transactions.
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          className="flex items-center gap-2 rounded-lg border px-4 py-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <Receipt className="mb-3 text-blue-500" />
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h2 className="mt-1 text-2xl font-bold">
            {transactions.length}
          </h2>
        </div>

        <div className="rounded-xl border p-5">
          <CreditCard className="mb-3 text-green-500" />
          <p className="text-sm text-gray-500">Successful Payments</p>
          <h2 className="mt-1 text-2xl font-bold">
            {transactions.filter(
              (item) =>
                ["paid", "succeeded"].includes(
                  item.paymentStatus?.toLowerCase()
                )
            ).length}
          </h2>
        </div>

        <div className="rounded-xl border p-5">
          <CreditCard className="mb-3 text-red-500" />
          <p className="text-sm text-gray-500">Unsuccessful Payments</p>
          <h2 className="mt-1 text-2xl font-bold">
            {transactions.filter(
              (item) =>
                ["failed", "unpaid"].includes(
                  item.paymentStatus?.toLowerCase()
                )
            ).length}
          </h2>
        </div>
      </div>

      {/* Search by service name + amount sorting */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service, customer or session ID..."
            aria-label="Search transactions by service name"
            className="w-full rounded-lg border bg-transparent py-3 pl-10 pr-4 outline-none"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort transactions by service price"
          className="rounded-lg border bg-transparent px-4 py-3 text-sm font-semibold outline-none sm:min-w-52"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Amount: Low to High</option>
          <option value="price-desc">Amount: High to Low</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-4">Customer Information</th>
              <th className="p-4">Related Service</th>
              <th className="p-4">Appointment Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Session ID</th>
              <th className="p-4">Payment Status</th>
              <th className="p-4">Transaction Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-4">
                  <p className="font-semibold">
                    {item.customerName || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.customerEmail || "N/A"}
                  </p>
                </td>

                <td className="p-4">
                  {item.serviceName || "N/A"}
                </td>

                <td className="p-4">
                  {item.appointmentDate
                    ? new Date(item.appointmentDate).toLocaleDateString()
                    : "N/A"}
                </td>

                <td className="p-4 font-semibold">
                  {item.currency?.toUpperCase() || "N/A"}{" "}
                  {item.paymentAmount ?? "N/A"}
                </td>

                <td className="p-4">
                  <span title={item.stripeSessionId || ""}>
                    {item.stripeSessionId
                      ? `${item.stripeSessionId.slice(0, 18)}...`
                      : "N/A"}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                      item.paymentStatus
                    )}`}
                  >
                    {item.paymentStatus || "Unknown"}
                  </span>
                </td>

                <td className="p-4">
                  {item.transactionDate
                    ? new Date(item.transactionDate).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}

            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Payment records are read-only. Payment status is updated only after
        Stripe confirms the payment.
      </p>
    </div>
  );
}
