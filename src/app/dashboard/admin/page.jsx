import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const Admin = async () => {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard/customer");
  }

  return (
    <div className="p-5 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Admin tools will appear here.
      </p>
    </div>
  );
};

export default Admin;
