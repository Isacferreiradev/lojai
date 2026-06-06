import { Sidebar } from "@/components/admin/sidebar";
import { Providers } from "@/components/shared/providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Providers>{children}</Providers>
      </main>
    </div>
  );
}
