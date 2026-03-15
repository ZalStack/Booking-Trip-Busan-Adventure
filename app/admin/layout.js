export const dynamic = "force-dynamic";

import { verifyAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  const isAdmin = await verifyAdmin()

  if (!isAdmin) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}