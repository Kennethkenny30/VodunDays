import { cn } from "@/lib/utils"
import { ShieldCheck, User } from "lucide-react"
import type { UserRole } from "@/lib/types/api"

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

// Badge de rôle utilisateur avec icône et couleur distincte
export function RoleBadge({ role, className }: RoleBadgeProps) {
  const isSuperAdmin = role === "SUPER_ADMIN"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        isSuperAdmin
          ? "bg-red-500/10 text-red-500 dark:bg-red-500/20"
          : "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
        className
      )}
    >
      {isSuperAdmin ? (
        <ShieldCheck className="size-3" />
      ) : (
        <User className="size-3" />
      )}
      {isSuperAdmin ? "Super Admin" : "Admin Culture"}
    </span>
  )
}
