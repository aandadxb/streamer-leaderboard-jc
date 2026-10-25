import LogoutButton from "./LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <h1 className="text-lg sm:text-xl font-semibold">Streamer Admin</h1>
        <LogoutButton />
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
