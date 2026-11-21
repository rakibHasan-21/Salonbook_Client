"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const ToastFromQuery = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    const success = searchParams.get("success");

    if (!error && !message && !success) return;

    if (error) toast.error(error);
    if (message) toast.info(message);
    if (success) toast.success(success);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    params.delete("message");
    params.delete("success");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [searchParams, pathname, router]);

  return null;
};

export default ToastFromQuery;
