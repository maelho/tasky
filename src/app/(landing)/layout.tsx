import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { Paths } from '~/config/site'

import { Navbar } from './_components/navbar'

export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userId, orgId } = await auth()

  if (userId && !orgId) {
    redirect(Paths.SelectOrg)
  }

  if (userId && orgId) {
    redirect(`${Paths.Organization}/${orgId}`)
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto pt-28">{children}</main>
    </div>
  )
}
