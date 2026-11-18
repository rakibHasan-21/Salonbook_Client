import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function CustomerLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "customer") {
    redirect("/Dashboard/admin");
  }

  return children;
}