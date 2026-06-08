import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { SalesNotification } from "@/components/store/sales-notification";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col overflow-x-hidden">{children}</main>
      <Footer />
      <SalesNotification />
    </div>
  );
}
