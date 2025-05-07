export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <main className="container mx-auto pt-28">{children}</main>
    </div>
  )
}
