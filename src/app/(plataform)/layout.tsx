import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { HydrateClient } from "~/trpc/server";

import { Navbar } from "./_components/navbar";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  return (
    <HydrateClient>
      <main className="min-h-svh mx-auto container">
        <Navbar orgId={orgId} />
        {children}
      </main>
    </HydrateClient>
  );
}
