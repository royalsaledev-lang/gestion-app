import { AuthProvider } from "@/features/auth/auth-provider"
import "./globals.css"
import { ToastProvider } from "@/features/auth/ToastContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body><ToastProvider><AuthProvider>{children}</AuthProvider></ToastProvider></body>
    </html>
  )
}

// BadgeStatus
// PriorityBadge
// PageHeader
// SectionCard
// EmptyState
// ConfirmDialog
// ActionMenu



// Auth module
// Users module
// Clients module
// Projects module
// Tasks module
// Freelancers module
// Payments module
// Activity module
// Notifications module