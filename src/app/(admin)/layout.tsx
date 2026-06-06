import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { Providers } from "@/components/shared/providers";

// Single auth gate for the whole /admin area. Works even if the proxy
// (middleware) doesn't run — unauthenticated users are sent to login.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || cookieStore.get("lojai_admin")?.value !== expected) {
    redirect("/entrar-admin?next=/admin");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Providers>{children}</Providers>
      </main>
    </div>
  );
}
