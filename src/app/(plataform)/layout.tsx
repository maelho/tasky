// import { auth } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'
import { HydrateClient } from '~/trpc/server'

// import { Navbar } from './_components/navbar'

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // const { orgId } = await auth()
  //
  // if (!orgId) {
  //   return redirect('/select-org')
  // }
  //
  //
  //
  // <Navbar orgId={orgId} />
  return (
    <HydrateClient>
      <main className="container mx-auto min-h-svh">{children}</main>
    </HydrateClient>
  )
}
