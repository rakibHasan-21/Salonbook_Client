import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  if (!session?.user) {
    redirect(
      "/sign-in?error=Please%20sign%20in%20to%20access%20the%20admin%20dashboard."
    );
  }

  if (session.user.role !== "admin") {
    redirect(
      "/unauthorized?reason=admin&error=You%20do%20not%20have%20permission%20to%20access%20the%20admin%20dashboard."
    );
  }

  return children;
}
