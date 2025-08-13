import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { HydrateClient } from "~/trpc/server";

import { Navbar } from "~/components/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  return (
    <HydrateClient>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar orgId={orgId} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </HydrateClient>
  );
}
