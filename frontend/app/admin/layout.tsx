import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminNav from '@/components/dashboard/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const logged = await getSession()
  if (!logged) redirect('/admin')

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminNav />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
